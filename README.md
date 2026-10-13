# StudyFlow AI

StudyFlow AI is an AI-powered learning platform that transforms study materials into notes, flashcards and personalized learning resources.

This repository starts with the 30-day MVP: sign in, create a study space, upload and parse a text-based PDF, then generate study notes and flashcards. It contains project setup and documentation only; application features will be added in small, reviewable changes.

## Technology

- Next.js with TypeScript for the web app and server endpoints
- Supabase Auth, PostgreSQL and private Storage
- OpenAI for the first AI generation integration

The MVP uses one application and one AI provider. Additional services will be introduced when usage shows they are needed.

## Development environment

1. Install an active LTS release of Node.js and a compatible npm version.
2. Copy `.env.example` to `.env.local` and fill in the values for a development Supabase project and the server-side AI key.
3. Run `npm install` after the Next.js application scaffold and its dependencies are added in the first feature change.

Never commit `.env.local`, credentials, uploaded documents or generated files. Keep development and production Supabase projects separate.

## Repository layout

| Path | Purpose |
|---|---|
| `src/` | Next.js application code, added feature by feature |
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
