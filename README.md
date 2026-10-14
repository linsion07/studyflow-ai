# StudyFlow AI

**Turn study materials into a more focused learning workflow.**

StudyFlow AI is an AI-powered learning platform for organizing course materials and turning text-based PDFs into study notes. The project is being built as a small, maintainable SaaS product for a global audience.

> **Current status:** email/password authentication and private learning spaces are implemented. The PDF upload and notes UI connect to a separately hosted private analysis service. Its algorithm code is intentionally excluded from this repository.

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
| Login and signup | Implemented | Email/password auth with optional email confirmation; requires Supabase configuration |
| Learning spaces | Implemented | Signed-in users can create, list, and open their own spaces |
| PDF upload and parsing | Integration ready | Private Supabase Storage and an external studyflow-core API; service is not included |
| Study notes | Integration ready | Structured notes are saved only after a successful response from the private AI service |
| Flashcards | Basic preview | Generated question-and-answer cards appear beneath the notes; the space-level study page is still a placeholder |

The pricing section describes the preview only. It does not offer a paid plan or collect payment information.

## Technology

| Layer | Choice | Status |
| --- | --- | --- |
| Web application | Next.js App Router, React and TypeScript | In use |
| Styling | Tailwind CSS | In use |
| Languages | `next-intl` with locale-prefixed routes | In use |
| Authentication | Supabase Auth with `@supabase/ssr` | In use |
| Database and private files | Supabase PostgreSQL and private Storage | In use |
| PDF analysis | Private `studyflow-core` HTTP service | Connect separately |
| Model generation | Configured by the private analysis service | Provider key required in that service |

The browser talks only to Next.js; Next.js checks the user and calls a private analysis API. The API contract is in [`docs/ai-engine-contract.md`](docs/ai-engine-contract.md). The engine implementation, sample files, and provider keys are not published here.

## Run locally

**Requirements:** Node.js 20.19+, 22.13+, or 24+, and npm. The supported Node versions are also declared in [`package.json`](package.json).

```bash
npm ci
```

Copy `.env.example` to `.env.local` and fill in the Supabase URL and publishable key. For PDF analysis, configure `STUDYFLOW_CORE_API_URL` and a shared `STUDYFLOW_CORE_API_TOKEN` for your separate private engine. The engine must have its own model provider key; the web app rejects rule-based fallback rather than presenting it as AI notes. Apply the Supabase migrations in filename order as described in [`supabase/README.md`](supabase/README.md).

Start the web app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to `/en`. The public pages run without a Supabase project; private spaces require Supabase configuration, and PDF analysis also requires the separate engine.

On Windows, if the system uses a local proxy to reach Supabase, start with `npm run dev:windows-proxy` instead. This reads the Windows proxy settings and enables Node's HTTPS proxy support for the development server. It requires Node.js 22.21+ or 24+; regular `npm run dev` remains the default elsewhere.

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
| `/{locale}/login` | Email/password login |
| `/{locale}/signup` | Email/password registration |
| `/{locale}/spaces` | Private learning-space list and creation |
| `/{locale}/spaces/{id}` | Upload PDF and list documents |
| `/{locale}/spaces/{id}/notes/{documentId}` | Structured study notes |

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
│   └── proxy.ts              # Locale routing and session refresh
├── docs/                     # Architecture and development notes
├── docs/ai-engine-contract.md # Contract for the separately hosted private engine
├── supabase/                 # Database and Storage migrations
├── .env.example              # Local configuration template
└── package.json
```

## MVP development order

1. **Accounts and data boundaries:** Supabase Auth and private route protection are implemented; define per-user data policies when tables are added.
2. **Learning spaces:** create, list and open spaces owned by the signed-in user.
3. **Documents:** upload PDFs to private storage and track processing status.
4. **Text extraction:** parse text-based PDFs and report unsupported or scanned files clearly.
5. **AI study tools:** generate notes and flashcards from extracted content.
6. **Validation:** collect feedback, measure reliability and AI cost, then refine the workflow.

The repository implements the client and server integration for study notes and a basic flashcard preview. The private engine must be deployed separately before those steps work. A dedicated flashcard study flow and later steps remain on the roadmap.

## Environment and security

Copy [`.env.example`](.env.example) to `.env.local` and set the Supabase and studyflow-core values above. The public pages remain available without them. See [`supabase/README.md`](supabase/README.md) for Auth and Storage setup. Never commit `.env.local`, API keys, uploaded study materials or generated build files. Keep development and production Supabase projects separate.

## Contributing

Use focused `feature/*` branches and pull requests. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch names, commit conventions and review expectations. Short architecture decisions and implementation notes belong in [`docs/`](docs/).
