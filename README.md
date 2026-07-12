# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Triskelix Frontend

Triskelix is a React, TypeScript, and Vite frontend for application security scanning, compliance reporting, and AI-assisted remediation workflows.

The app includes a public landing page and authenticated product views for submitting scans, tracking scan status, reviewing findings, generating remediation guidance, downloading reports, and managing account settings.

## Features

- Landing page with Triskelix product positioning and calls to action
- Login and registration flow backed by cookie-based authentication
- Scan submission for pasted code, GitHub repositories, and live URLs
- Scan status tracking across ingestion, analysis, reporting, completion, and failure states
- Dashboard with scan history, security scores, and vulnerability counts
- Detailed report view with markdown report and GitHub Actions output
- GitHub account connection and remediation PR workflow hooks
- Settings page for profile and integration management

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI primitives
- Zustand
- Recharts
- Lucide React
- Sonner

## Repository Layout

```text
.
+-- app/                 # Vite frontend package
|   +-- src/             # Application source
|   +-- package.json     # Frontend scripts and dependencies
|   +-- vite.config.ts   # Vite configuration
+-- README.md            # Repository overview
```

## Prerequisites

- Node.js 20 or newer
- npm
- A running Triskelix backend API

The frontend defaults to `http://localhost:8000` when `VITE_API_URL` is not set.

## Getting Started

Install dependencies:

```bash
cd app
npm install
```

Create an environment file if the backend is not running on the default URL:

```bash
cp .env.example .env
```

Set the API URL in `app/.env`:

```bash
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The Vite dev server will print the local URL, typically `http://localhost:3000/` or `http://localhost:5173/`.

## Scripts

Run these from the `app` directory:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Routes

- `/` - landing page
- `/login` - sign in
- `/register` - create an account
- `/scan` - create a new scan
- `/scan/:id` - scan status page
- `/dashboard` - scan history and summary metrics
- `/report/:id` - detailed report view
- `/settings` - profile and account settings

## API Notes

The frontend talks to the backend through `app/src/api/client.ts`.

- Requests use `credentials: 'include'` so HttpOnly auth cookies are sent automatically.
- Access token refresh is handled transparently after authenticated request failures.
- The UI expects backend support for auth, scan, remediation, GitHub, and report endpoints.
