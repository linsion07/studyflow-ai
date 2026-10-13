# StudyFlow AI

StudyFlow AI is an AI-powered learning platform that transforms study materials into notes, flashcards and personalized learning resources.

This repository starts with the 30-day MVP: sign in, create a study space, upload and parse a text-based PDF, then generate study notes and flashcards. The current application contains the frontend foundation and static pages. Authentication, PDF processing, AI generation and database integration are not connected yet.

## Technology

- Next.js with TypeScript for the web app and server endpoints
- Supabase Auth, PostgreSQL and private Storage
- OpenAI for the first AI generation integration

The MVP uses one application and one AI provider. Additional services will be introduced when usage shows they are needed.

## Development environment

1. Install a supported Node.js release (20.19+, 22.13+, or 24+) and npm.
2. Run `npm ci`.
3. Run `npm run dev` and open `http://localhost:3000`.

The four initial routes are `/`, `/login`, `/signup` and `/spaces`. Login and signup controls are intentionally disabled until authentication is implemented. No credentials are needed to run the current static pages. Before integrating Supabase or AI, copy `.env.example` to `.env.local` and fill in development values.

Run `npm run lint`, `npm run typecheck` and `npm run build` before opening a pull request. Tailwind CSS 4 is configured through `postcss.config.mjs` and `src/app/globals.css`; it does not need a separate `tailwind.config` file for this setup.

Never commit `.env.local`, credentials, uploaded documents or generated files. Keep development and production Supabase projects separate.

## Repository layout

| Path | Purpose |
|---|---|
| `src/app/` | App Router pages and root layout |
| `src/components/` | Shared UI components |
| `src/lib/` | Shared configuration and helpers |
| `src/types/` | Shared TypeScript types |
| `public/` | Public static assets |
| `docs/` | Architecture decisions and development notes |
| `supabase/` | Versioned database migrations and local configuration |

## Roadmap

1. Authentication and study spaces
2. Private PDF upload and text extraction
3. AI study notes
4. Flashcards and basic review
5. User feedback, reliability and cost measurement

Payment, AI Tutor, mobile clients and enterprise features are outside the initial MVP. See [CONTRIBUTING.md](CONTRIBUTING.md) for branch and commit conventions.
