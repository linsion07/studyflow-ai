# StudyFlow AI

**Turn study materials into a more focused learning workflow.**

StudyFlow AI is an AI-powered learning platform for organizing course materials and, in the planned MVP, turning text-based PDFs into study notes and flashcards. The project is being built as a small, maintainable SaaS product for a global audience.

> **Current status:** frontend preview. The landing page and language switching work; authentication, file upload, PDF processing, AI generation and database storage are not connected yet.

## What the MVP will do

1. Sign up and sign in.
2. Create a learning space for a subject or course.
3. Upload a text-based PDF to that space.
4. Extract its text and generate study notes.
5. Generate flashcards for review.

The intended flow is **learning space → PDF → extracted text → notes and flashcards → review**. Quizzes, study plans, AI Tutor, payments and enterprise features are outside this first release.

## What works today

| Area | Status | What you can see now |
| --- | --- | --- |
| Landing page | Preview available | Hero, features, pricing information and FAQ |
| Internationalization | Available | English, Simplified Chinese and Japanese routes; language picker |
| Login and signup | UI preview | Forms are visible, but submission is disabled |
| Learning spaces | UI preview | Empty state; creating a space is not available yet |
| PDF upload and parsing | Planned | No upload endpoint or storage integration yet |
| AI notes and flashcards | Planned | No AI endpoint or model calls yet |

The pricing section describes the preview only. It does not offer a paid plan or collect payment information.

## Technology

| Layer | Choice | Status |
| --- | --- | --- |
| Web application | Next.js App Router, React and TypeScript | In use |
| Styling | Tailwind CSS | In use |
| Languages | `next-intl` with locale-prefixed routes | In use |
| Authentication | Supabase Auth | Planned for MVP |
| Database and private files | Supabase PostgreSQL and Storage | Planned for MVP |
| AI generation | OpenAI as the first provider | Planned for MVP |

The MVP keeps the web app and its future server endpoints in one Next.js project. Additional services and model providers can be considered after real usage shows a need for them.

## Run locally

**Requirements:** Node.js 20.19+, 22.13+, or 24+ and npm. The supported versions are also declared in [`package.json`](package.json).

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to `/en`. The current frontend preview runs without API keys or a Supabase project.

For a production build and local production server:

```bash
npm run build
npm run start
```

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check code style and common errors |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` | Build and validate the production app |
| `npm run start` | Serve a completed production build |

Run lint, typecheck and build before opening a pull request. Tailwind CSS is configured through [`postcss.config.mjs`](postcss.config.mjs) and [`src/app/globals.css`](src/app/globals.css); this setup does not need a separate `tailwind.config` file.

## Pages and languages

| Route | Current page |
| --- | --- |
| `/` | Redirects to English at `/en` |
| `/en`, `/zh`, `/ja` | Localized landing page |
| `/{locale}/login` | Login preview |
| `/{locale}/signup` | Signup preview |
| `/{locale}/spaces` | Learning spaces preview |

The navigation language picker switches between English, 中文 and 日本語 while keeping the current page. One shared set of page components serves all three languages; translations live in [`messages/`](messages/). Routing, navigation and message loading live in [`src/i18n/`](src/i18n/). English is the default for `/`; automatic language detection is currently disabled.

When adding copy, add the same message key to all three JSON files. A new language also needs a locale in [`src/i18n/routing.ts`](src/i18n/routing.ts) and an entry in the language picker.

## Project layout

```text
studyflow-ai/
├── messages/                 # en, zh and ja translations
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/         # Shared localized pages and layout
│   │   └── globals.css
│   ├── components/           # Header, language picker and shared UI
│   ├── i18n/                 # Routing, navigation and message loading
│   ├── lib/                  # Shared configuration and helpers
│   ├── types/                # Shared TypeScript types
│   └── proxy.ts              # Locale routing proxy
├── docs/                     # Architecture and development notes
├── supabase/                 # Reserved for database migrations and config
├── .env.example              # Variables for future integrations
└── package.json
```

## MVP development order

1. **Accounts and data boundaries:** connect Supabase Auth, create user profiles and protect private data.
2. **Learning spaces:** create, list and open spaces owned by the signed-in user.
3. **Documents:** upload PDFs to private storage and track processing status.
4. **Text extraction:** parse text-based PDFs and report unsupported or scanned files clearly.
5. **AI study tools:** generate notes and flashcards from extracted content.
6. **Validation:** collect feedback, measure reliability and AI cost, then refine the workflow.

The repository currently implements only the frontend foundation. The order above is a plan, not a claim that these services are available.

## Environment and security

The current preview needs no environment variables. [`.env.example`](.env.example) lists the Supabase and OpenAI values expected by later phases; copy it to `.env.local` only when those integrations are implemented. Never commit `.env.local`, API keys, uploaded study materials or generated build files. Keep development and production Supabase projects separate.

## Contributing

Use focused `feature/*` branches and pull requests. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch names, commit conventions and review expectations. Short architecture decisions and implementation notes belong in [`docs/`](docs/).
