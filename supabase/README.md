# Supabase Auth setup

No application table is required for email/password authentication. Supabase Auth stores accounts in its managed `auth.users` schema. The separate learning-space table is described below.

1. Create a Supabase project. In **Authentication → Providers**, enable **Email** and choose whether to require email confirmation. Confirmation is enabled by default on hosted projects.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the project's **Connect** dialog. Never use a secret or service-role key in a `NEXT_PUBLIC_` variable.
3. In **Authentication → URL Configuration**, set **Site URL** to `http://localhost:3000` for local development. Add `http://localhost:3000/en/auth/confirm`, `http://localhost:3000/zh/auth/confirm`, and `http://localhost:3000/ja/auth/confirm` to the redirect allow list. These three local URLs were added to the connected development project on 2026-10-14. Add the equivalent HTTPS URLs for production.
4. The default Supabase confirmation email works with this app's PKCE callback: it redirects to `/{locale}/auth/confirm?code=...`, where the code is exchanged for a cookie-based session. For best results, open the confirmation link in the same browser used for signup. If it opens elsewhere, the address may be verified but the app cannot exchange the code; return to the login page and sign in with the new password.

   If a custom SMTP provider is configured and you want confirmation to work across browsers without the PKCE verifier, the **Confirm signup** template can instead use:

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
   ```

   The app passes the active locale's `/{locale}/auth/confirm` URL as `RedirectTo`. The callback also accepts this token-hash form. New free-tier Supabase projects using the default SMTP service cannot edit email templates.

5. Restart `npm run dev` after changing `.env.local`. Open `/{locale}/signup`, register with email/password, follow the email link if confirmation is enabled, then visit `/{locale}/spaces`. Log out from the header and verify that `/{locale}/spaces` redirects to `/{locale}/login`.

If registration returns an unavailable-service error on Windows while the Supabase dashboard opens normally, Node may be missing the proxy used by the browser. Use `npm run dev:windows-proxy` with Node.js 22.21+ or 24+; it reads the Windows system proxy for the configured project URL. This changes only the local development process. Do not disable TLS verification.

Supabase's default SMTP service sends confirmation emails only to Supabase organization member addresses and has a very low send limit. For public signup, configure a custom SMTP provider in **Authentication → Emails → SMTP Settings**. Do not turn off email confirmation as a workaround. For production, also set the Site URL to the production origin, allow its three locale confirmation URLs and configure the same environment variables in the deployment platform.

## Learning spaces table

For a new Supabase project, apply the migrations in filename order before using `/spaces`. Paste each migration into the project's **SQL Editor** and run it once. The connected StudyFlow development project had both migrations applied on 2026-10-14. Keep migration files in Git so database changes can be reproduced in another environment.

The first migration creates `public.study_spaces` with `id`, `user_id`, `name`, and `created_at`. The second migration adds a nullable `description` column for future space summaries. The table has RLS enabled, grants signed-in users only `SELECT` and `INSERT`, and restricts both operations to rows whose `user_id` matches `auth.uid()`. Anonymous users have no table privileges. No update or delete operation is exposed yet.

After applying both migrations, sign in and create a space at `/{locale}/spaces`. Confirm the name and creation date appear in the list, then open the card at `/{locale}/spaces/{id}`. Sign in with a second account to verify that its list does not contain the first account's space and that the first account's detail URL returns a not-found page.

## PDF documents and private storage

Apply `migrations/20261014020000_create_study_documents.sql` after the two learning-space migrations. It creates `public.documents`, enables RLS, and creates the private `study-pdfs` Storage bucket. The row stores the signed-in owner, parent space, original filename, private object path, processing status, and the structured notes JSON. The object path starts with the user's ID, and Storage policies allow users to upload and read only in their own folder. The bucket accepts PDFs up to 6 MB. No public file URL is generated.

Test with one signed-in account by uploading a searchable PDF in its space and opening the notes page. With another account, confirm that the document and notes are not listed and the first account's notes URL returns a not-found page. The API checks space ownership before uploading and uses the signed-in user's Supabase session; a service-role key is not needed.
