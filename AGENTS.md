# Project Rules

## Deployment

- This is a TanStack Start / Nitro SSR app deployed on Vercel.
- Use the repository root as the Vercel Root Directory.
- Use the Vercel settings from `vercel.json`: install with `npm ci` and build with `NITRO_PRESET=vercel npm run build`.
- Keep `package-lock.json` as the source of truth for Vercel installs. Do not let Vercel choose Bun just because `bun.lock` exists.
- A correct Vercel build should produce `.vercel/output` for Nitro. If deploy logs show only `dist/`, check the build command and Nitro preset.

## Environment Variables

- Never commit `.env`, `.env.*`, `VERCEL_ENV_IMPORT.local.env`, or `VERCEL_ENV_VALUES.local.md`.
- Keep `.env.example` committed with variable names only and no real values.
- Supabase URL values must be the base project URL, like `https://PROJECT_REF.supabase.co`, with no `/rest/v1`.
- Supabase publishable/anon keys are frontend-safe and may be used in `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Supabase service-role keys are secret backend-only keys. Never put a service-role key in a `VITE_*` variable or frontend code.
- Gemini API keys are secret backend-only keys. Never put `GEMINI_API_KEY` in a `VITE_*` variable.
- If Gemini is added later, default student projects to `GEMINI_MODEL=gemini-2.5-flash-lite` unless the user asks for another model.

## Supabase And Migrations

- The Supabase project ref is the part before `.supabase.co` in `https://PROJECT_REF.supabase.co`.
- Migrations are SQL files that create or update database tables, policies, triggers, and indexes.
- This app uses `profiles` and `game_results`; apply the SQL files in `supabase/migrations` to the target Supabase project before deploying.
- Only require `SUPABASE_SERVICE_ROLE_KEY` for trusted server admin work that must bypass RLS. Current gameplay reads and writes through the signed-in user's client session and does not require service role for normal play.

## Before Deploy

- Confirm `.env` is ignored and not tracked by Git.
- Confirm `.env.example` is committed and contains no secrets.
- Add required variables in Vercel Project Settings for Production, Preview, and Development.
- Run `npm.cmd run build` locally on Windows PowerShell, or `npm run build` in a shell where npm scripts are allowed.
- Confirm Supabase migrations have been applied to the project ref used by Vercel.
