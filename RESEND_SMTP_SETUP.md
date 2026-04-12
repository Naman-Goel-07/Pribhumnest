# Resend SMTP + Supabase Auth — Setup Guide

All emails (signup verification, password reset) are now sent through
**Resend** configured as Supabase's custom SMTP provider. No backend code
is involved — Supabase handles delivery automatically.

---

## Step 1: Create a Resend Account

1. Go to **[resend.com](https://resend.com)** and sign up (free tier: 3,000 emails/month)
2. Navigate to **API Keys** → **Create API Key**
3. Name it `pribhumnest-supabase`
4. Copy the key — it starts with `re_...`

---

## Step 2: Add & Verify Your Domain in Resend

> Required for production. Skippable in dev (use `onboarding@resend.dev`).

1. In Resend dashboard → **Domains** → **Add Domain**
2. Enter your domain: `pribhumnest.in`
3. Add the DNS records Resend shows you (SPF, DKIM, DMARC) in your DNS provider
4. Click **Verify** — usually takes < 5 minutes

---

## Step 3: Configure Supabase SMTP

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** → your project
2. Go to **Authentication** → **SMTP Settings** (under "Email" section)
3. Toggle **Enable Custom SMTP** → ON
4. Fill in the fields:

| Field | Value |
|---|---|
| **SMTP Host** | `smtp.resend.com` |
| **Port** | `587` |
| **Username** | `resend` |
| **Password** | `re_YOUR_API_KEY` (your Resend API key) |
| **Sender Email** | `noreply@pribhumnest.in` |
| **Sender Name** | `Pribhumnest` |

5. Click **Save**

---

## Step 4: Customize Email Templates (Optional but Recommended)

In Supabase Dashboard → **Authentication** → **Email Templates**:

### Confirm Signup Template
```html
<h2>Verify your email</h2>
<p>Click the link below to verify your email address for Pribhumnest:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm my email</a></p>
<p>This link expires in 24 hours.</p>
```

### Reset Password Template
```html
<h2>Reset your password</h2>
<p>Click the link below to set a new password for your Pribhumnest account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
```

---

## Step 5: Configure Redirect URLs in Supabase

In Supabase Dashboard → **Authentication** → **URL Configuration**:

| Setting | Value |
|---|---|
| **Site URL** | `https://pribhumnest.in` (prod) or `http://localhost:5173` (dev) |
| **Redirect URLs** | Add: `http://localhost:5173/update-password` |
| | Add: `https://pribhumnest.in/update-password` |
| | Add: `http://localhost:5173/verify-email` |

> Without these in the allowlist, Supabase will **reject** the redirectTo URL.

---

## Step 6: Enable Email Confirmation (if not already on)

In Supabase Dashboard → **Authentication** → **Providers** → **Email**:

- ✅ **Enable Email Signup** — ON
- ✅ **Confirm Email** — ON  ← this is the key setting
- **Secure Email Change** — ON (recommended)

---

## How It Works After Setup

```
SIGNUP
  User fills Register form
  → supabase.auth.signUp({ email, password, options: { data: { name, contact } } })
  → Supabase triggers email via Resend SMTP
  → User receives "Confirm your email" from noreply@pribhumnest.in
  → User clicks link → redirected to pribhumnest.in
  → onAuthStateChange fires SIGNED_IN → Redux state updated → user logged in ✅

PASSWORD RESET
  User fills ForgotPassword form
  → supabase.auth.resetPasswordForEmail(email, { redirectTo: '.../update-password' })
  → Supabase triggers email via Resend SMTP
  → User receives "Reset Password" from noreply@pribhumnest.in
  → User clicks link → redirected to /update-password with token in URL
  → detectSessionInUrl: true intercepts token → temp session set
  → supabase.auth.updateUser({ password: newPassword }) ✅
```

---

## Testing

Send a test email from Supabase Dashboard → Authentication → SMTP Settings → **Send Test Email**.

Check your **Resend Dashboard → Logs** to verify delivery status.

---

## Quick Checklist

- [ ] Resend account created, API key copied
- [ ] Domain verified in Resend (`pribhumnest.in`)
- [ ] SMTP configured in Supabase Dashboard
- [ ] Redirect URLs added to Supabase URL Configuration allowlist
- [ ] Email Confirmation enabled in Supabase Auth settings
- [ ] `drop_otp_table.sql` executed in Supabase SQL Editor
- [ ] `emailService.js`, `otpController.js`, `otpRoutes.js` confirmed deleted
- [ ] `nodemailer` uninstalled from Server (`npm uninstall nodemailer`)
