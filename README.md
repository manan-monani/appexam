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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Secure Exam Code Platform
A secure coding exam platform inspired by HackerRank, built with Next.js, Supabase, Tailwind CSS, CodeMirror, Judge0, and Socket.IO. Supports Google OAuth authentication, browser lockdown, real-time leaderboards, and plagiarism detection.
Features

Authentication: Google OAuth via Supabase.
Role-based Access: Student, teacher, and admin dashboards.
Secure Exams: Browser lockdown with full-screen mode and event logging.
Code Execution: Asynchronous submission processing with Judge0.
Real-time Leaderboards: Powered by Redis and Socket.IO.
Plagiarism Detection: MOSS integration (placeholder).
Reporting: Performance and plagiarism reports for teachers/admins.

Prerequisites

Node.js >= 18
Supabase project
Judge0 instance
Redis instance (local or Upstash)
MOSS account (for plagiarism detection)

Setup

Clone the Repository
git clone <repository-url>
cd secure-exam-code


Install Dependencies
npm install


Configure Environment VariablesCreate a .env.local file based on .env.local template:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WS_URL=your_websocket_url
JUDGE0_URL=your_judge0_url
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token


Set Up Supabase

Apply the migration script (supabase/migrations/202507201147_create_tables.sql) using Supabase SQL Editor.
Configure Google OAuth in Supabase Authentication settings.


Set Up MOSS

Configure MOSS for plagiarism detection and update /scripts/plagiarismCheck.ts.


Run the Application
npm run dev


Run the Submission Worker
node worker/submissionWorker.js



Project Structure

/app: Next.js pages and API routes
/components: Reusable UI components
/features: Feature-specific hooks, components, and types
/hooks: Custom React hooks
/lib: Utility libraries (e.g., Supabase client, security)
/schemas: Zod schemas for validation
/styles: CSS styles
/utils: General utilities
/worker: BullMQ worker for submission processing
/supabase/migrations: Database migration scripts

Usage

Students: Access active exams, submit code, view submission history.
Teachers: Create exams, view reports for their exams.
Admins: Manage users, exams, and view all reports.

Contributing
Submit issues or pull requests to the repository.
License
MIT