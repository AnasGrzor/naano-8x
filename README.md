This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. Server-only; never exposed to the client. |
| `APIFY_API_KEY` | Apify token used for the LinkedIn import. |
| `APIFY_PROFILE_ACTOR_ID` | Apify actor that scrapes the public profile. |
| `APIFY_POSTS_ACTOR_ID` | Apify actor that scrapes public posts. |

Never commit a real `.env`. Only `.env.example`, which holds empty placeholders, is tracked.

## Database

Neon Postgres accessed through Drizzle ORM. Schema lives in [`lib/db/schema.ts`](lib/db/schema.ts); the server-only client is [`lib/db/index.ts`](lib/db/index.ts).

### Migration commands

```bash
# 1. Generate a new SQL migration after editing lib/db/schema.ts
pnpm db:generate

# 2. Apply pending migrations to the database in DATABASE_URL
pnpm db:migrate

# 3. Browse data in Drizzle Studio
pnpm db:studio
```

Generated migrations are committed under `drizzle/`. Always review the generated SQL before applying it.

`drizzle-kit push` is intentionally **not** exposed as a script: it mutates the schema directly and would let changes reach production without a reviewed migration. Promote schema changes by running `pnpm db:migrate` against the target environment.

### Tables

- `creator_profiles` — one row per imported creator, unique per `owner_key`. Flexible arrays (`experience`, `education`, `skills`) are JSONB; searchable values stay scalar columns.
- `linkedin_posts` — public posts, unique on `(profile_id, external_id)` so re-importing updates rows instead of duplicating them. Cascades on profile delete.

### Authentication placeholder

Signup is not implemented yet, so all data is scoped to the temporary key `DEMO_OWNER_KEY` (`"demo-user"`) in [`lib/db/owner.ts`](lib/db/owner.ts). Replacing `getCurrentOwnerKey()` with the authenticated user id is the only change needed — the schema, queries and UI stay as they are.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
