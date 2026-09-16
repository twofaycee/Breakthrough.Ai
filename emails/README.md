# BREAKTHROUGH email templates

The branded confirmation design is in `confirmation-email.html`.

It is written for Supabase Auth email templates and uses Supabase's `{{ .ConfirmationURL }}` variable.

## Supabase setup

In Supabase Dashboard, open Authentication → Email Templates → Confirm signup and replace the existing template with the contents of `confirmation-email.html`.

The confirmation route is already implemented at `/auth/confirm`, and the signup flow sends users there via `emailRedirectTo`.

## Important

The repository template is intentionally self-contained and uses only the public BREAKTHROUGH logo asset. No secret keys or service-role credentials belong in this file.
