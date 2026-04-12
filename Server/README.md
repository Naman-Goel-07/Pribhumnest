# Pribhumnest Backend — Production Server

A production-grade Express.js + Supabase backend for the Pribhumnest PG/Property discovery platform.

---

## Quick Setup

### 1. Install Dependencies
```bash
cd Server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your Supabase URL/keys and Email credentials
```

### 3. Set Up the Database
1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Paste the entire contents of `supabase/schema.sql` and run it

### 4. Create Storage Bucket
The schema.sql creates the bucket automatically, but if it fails:
1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `property-images`, set to **Public**

### 5. Start the Server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | Yes | `development` or `production` |
| `FRONTEND_URL` | Yes | React app URL for CORS (e.g., `http://localhost:5173`) |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (keep secret!) |
| `EMAIL_USER` | Yes | Gmail address for OTP sending |
| `EMAIL_PASS` | Yes | Gmail App Password (not your real password) |

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords

---

## API Reference

### Authentication (`/api/user`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | Public | Login with email/password |
| POST | `/register` | Public | Register a new user |
| GET | `/getAccess` | 🔒 Cookie | Get current session + profile |
| GET | `/logoutUser` | 🔒 Cookie | Clear session cookie |
| POST | `/forgotPassword` | Public | Send password reset OTP |
| POST | `/otp-Verify` | Public | Verify reset OTP |
| POST | `/updatePassword` | Public | Set new password post-OTP |

### Admin Users (`/api/user`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/allUsers` | 🔒 Admin | List all system users |
| PATCH | `/update-role/:id` | 🔒 Admin | Change a user's role |
| DELETE | `/delete-user/:id` | 🔒 Admin | Permanently delete user |
| GET | `/admin/all-enquiries` | 🔒 Admin | All enquiries system-wide |
| GET | `/admin/all-properties` | 🔒 Admin | All properties (incl. inactive) |

### Properties (`/api/property`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | All active properties (filterable) |
| GET | `/details/:id` | Public | Single property details |
| POST | `/add-property` | 🔒 Cookie | Add property + upload images |
| DELETE | `/delete-property/:id` | 🔒 Cookie | Soft-delete property |
| POST | `/enquiry` | 🔒 Cookie | Submit enquiry for a property |

**Property filters** (query params on `GET /api/property`):
- `city` — case-insensitive partial match
- `gender` — `Boys`, `Girls`, or `Co-Living`
- `min_rent` — minimum Single sharing rent
- `max_rent` — maximum Single sharing rent

### OTP (`/api/otp`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/send-otp` | Public | Send pre-registration OTP |
| POST | `/verify-otp` | Public | Verify pre-registration OTP |
