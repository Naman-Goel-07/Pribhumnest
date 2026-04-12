# Pribhumnest Backend — Architecture & Explanatory Document

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                         │
│           axios({ withCredentials: true })                       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS + HttpOnly Cookie
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               Express.js API Server (Node.js)                    │
│                                                                  │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────────┐   │
│  │ CORS/Cookie│  │  authMiddleware│  │  adminMiddleware      │   │
│  │  Parser    │  │  (JWT verify)  │  │  (role == 'admin')    │   │
│  └─────┬──────┘  └──────┬─────────┘  └──────────┬───────────┘   │
│        │                │                        │               │
│  ┌─────▼────────────────▼────────────────────────▼───────────┐  │
│  │              Controllers (Business Logic)                   │  │
│  │  userController  │  propertyController  │  otpController   │  │
│  └─────────────────────────────────────────────────────────-──┘  │
│                         │                                         │
│  ┌──────────────────────▼──────────────────────────────────────┐  │
│  │              Supabase Clients                                 │  │
│  │   anonClient (respects RLS) │ adminClient (bypasses RLS)    │  │
│  └──────────────────────┬──────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    Supabase (Backend-as-a-Service)                │
│                                                                  │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐   │
│  │ Auth Module │  │  PostgreSQL DB   │  │  Storage Bucket   │   │
│  │ (JWT issue) │  │  (RLS enforced)  │  │ (property-images) │   │
│  └─────────────┘  └──────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. How Cookie-Based Sessions Work

### The Problem with JWT in localStorage
Storing tokens in `localStorage` makes them vulnerable to XSS attacks — any
JavaScript on the page can read them.

### The Solution: HttpOnly Cookies
```
Login Request
   │
   ▼
Express receives credentials
   │
   ▼  supabase.auth.signInWithPassword()
   │
   ▼
Supabase returns { session.access_token }
   │
   ▼
Express: res.cookie("pribhumnest_token", access_token, {
           httpOnly: true,   ← JS cannot read this cookie
           secure: true,     ← HTTPS only (in production)
           sameSite: "None", ← Required for cross-origin
           maxAge: 7 days
         })
   │
   ▼
Browser stores cookie automatically
   │
Future requests: browser auto-sends cookie with every request
   │
   ▼
authMiddleware: const token = req.cookies.pribhumnest_token
   │
   ▼  adminClient.auth.getUser(token)
   │
   ▼
Supabase verifies JWT, returns user
   │
   ▼
req.user = user, req.profile = profile → passed to controller
```

### Session Persistence on Page Reload
The React `App.jsx` dispatches `getAccess()` on mount:
```
App mounts
   → dispatch(getAccess())
   → GET /api/user/getAccess (browser auto-sends cookie)
   → authMiddleware verifies cookie
   → Returns { isAuthenticated: true, user: { role, name, ... } }
   → Redux state updated → protected routes unlock
```

---

## 3. How RLS Interacts with the Express Server

This project uses a **Hybrid Security Model**:

```
         Layer 1: Express Middleware (authMiddleware)
                  ↓ 401 if no valid cookie
         Layer 2: PostgreSQL Row Level Security
                  ↓ Always enforced on DB level as a fail-safe
```

### Two Supabase Clients Explained

| Client | Key Used | Respects RLS | Use Case |
|---|---|---|---|
| `anonClient` | Anon Key | ✅ Yes | Public reads (property listings) |
| `adminClient` | Service Role Key | ❌ No (bypasses) | Admin ops, JWT verification |

### Why the Two-Layer Approach?

**Express validates identity** → the cookie + Supabase JWT verification confirms who the user is and enforces role-based access in application code.

**RLS is the database fail-safe** → even if a bug in Express accidentally skips auth middleware, the database will still refuse unauthorized writes because the row-level policies are enforced at the PostgreSQL engine level.

Example flow for property deletion:
```
DELETE /api/property/delete-property/:id
   │
   ├─ [Layer 1] authMiddleware: validates JWT cookie → sets req.user
   ├─ [Layer 1] Controller checks: owner_id === req.user.id OR role === 'admin'
   │                               → 403 if not authorized
   └─ [Layer 2] RLS policy: "properties_owner_delete"
                             USING (auth.uid() = owner_id)
                             → DB rejects even if Express bug slips through
```

---

## 4. Database Schema Relationships

```
auth.users (Supabase managed)
    │ (trigger → auto-creates)
    ▼
profiles ──────────────────────────────────────────────
    │ id (UUID, PK)                                    │
    │ role: 'user' | 'admin' | 'pg_owner'              │
    │ name, email, contact                             │
    │                                                  │
    │ 1:N                                              │
    ▼                                                  │
properties                                             │
    │ id (UUID, PK)                                    │ 1:N
    │ owner_id → profiles.id                           │
    │ title, city, gender, sharing (JSONB), ...        │
    │                                                  ▼
    │ 1:N                                         enquiries
    ▼                                              user_id → profiles.id
property_images                                    property_id → properties.id
    │ id (UUID, PK)
    │ property_id → properties.id
    │ image_url (Supabase Storage public URL)
    │ display_order (integer for ordering)
    ▼
(Supabase Storage: property-images bucket)
    Path structure: {owner_id}/{property_id}/{uuid}.ext
```

### Why Separate `property_images` Table?
The original architecture stored images as an array in the property document
(MongoDB style). For PostgreSQL:
- Arrays of URLs violate 1NF (First Normal Form)
- Separate table allows: ordering, individual deletion, future metadata
- Enables efficient indexed queries: `WHERE property_id = ?`

---

## 5. Image Upload Flow

```
Frontend: <input type="file" multiple /> → FormData.append("Images", file)
   │
   ▼
POST /api/property/add-property (multipart/form-data)
   │
   ├─ authMiddleware → validates cookie
   ├─ multer.array("Images", 4) → stores files in RAM (memoryStorage)
   │                               → req.files = [{ buffer, mimetype, originalname }]
   ▼
propertyController.addProperty()
   │
   ├─ Insert property row → get property.id
   │
   ├─ uploadImagesToStorage(req.files, userId, propertyId)
   │     ├─ For each file:
   │     │     path = "{userId}/{propertyId}/{uuid}.ext"
   │     │     adminClient.storage.from("property-images").upload(path, buffer)
   │     │     → Get public URL
   │     └─ Returns [url1, url2, url3, url4]
   │
   └─ insertPropertyImages(propertyId, imageUrls)
         → INSERT INTO property_images (property_id, image_url, display_order)
```

---

## 6. Supabase Dashboard Setup Checklist

### Authentication Settings
- [ ] **Email Auth**: Enabled (Settings → Auth → Email)
- [ ] **Disable email confirmation** for immediate login (or enable + handle flow)
- [ ] **SMTP Custom Provider**: Configure your email in Auth → SMTP Settings

### Database
- [ ] Run `supabase/schema.sql` in SQL Editor

### Storage
- [ ] Bucket `property-images` created (done by schema.sql, verify it exists)
- [ ] Bucket visibility: **Public**

### API Keys
- [ ] Copy `Project URL` → `SUPABASE_URL` in `.env`
- [ ] Copy `anon public` key → `SUPABASE_ANON_KEY`
- [ ] Copy `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ **NEVER expose the service role key to the frontend**

---

## 7. Production Deployment Notes

### Backend (Railway / Render / Fly.io)
1. Set all `.env` variables in the platform's environment settings
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL` to your Vercel deployment URL (e.g., `https://pribhumnest.in`)
4. Cookie `SameSite: 'None'` + `Secure: true` activates automatically in production

### Frontend Update Required
Update `VITE_BACKEND_URL` in Client `.env` to your deployed backend URL:
```
VITE_BACKEND_URL=https://your-backend.railway.app
```

### CORS Gotcha
If frontend is on `https://www.pribhumnest.in` but you set `FRONTEND_URL=https://pribhumnest.in` (no www), cookies will be rejected. Make sure the URLs match exactly.

---

## 8. Known Issues & Technical Debt

| Issue | Location | Recommendation |
|---|---|---|
| `uuid` package not in package.json | `supabaseHelpers.js` | Replace with `crypto.randomUUID()` (Node 14.17+) |
| Gmail SMTP has rate limits | `emailService.js` | Replace with Resend/SendGrid for production |
| OTP is plain text in DB | `registration_otps` | Hash OTP with bcrypt before storing |
| No rate limiting | All public routes | Add `express-rate-limit` middleware |
| No request logging | `server.js` | Add `morgan` for structured HTTP logs |
| `is_active` soft-delete | Admin can't restore | Add a `PATCH /admin/restore-property/:id` endpoint |
