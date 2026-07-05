# Triskelix

  Triskelix is a React + TypeScript + Vite frontend for application security scanning, compliance reporting, and AI-assisted remediation workflows.

  It provides a public landing page plus authenticated views for running scans, reviewing findings, downloading reports, and managing account settings.

  ## Features

  - Public marketing landing page with product overview and calls to action.
  - Authentication flow for login and registration.
  - Scan submission for pasted code, GitHub repositories, and live URLs.
  - Scan status tracking and detailed scan reports.
  - Dashboard with scan history, security scores, and vulnerability counts.
  - Settings page for profile updates.
  - Cookie-based authentication with automatic refresh handled by the API client.

  ## Tech Stack

  - React 19
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Radix UI primitives
  - Zustand for client state
  - Recharts, Lucide, Sonner, and other UI utilities

  ## Prerequisites

  - Node.js 20 or newer
  - A running Triskelix backend API

  If no API URL is configured, the frontend defaults to `http://localhost:8000`.

  ## Setup

  Install dependencies:

  ```bash
  npm install
  ```

  Optionally set the API base URL in an `.env` file:

  ```bash
  VITE_API_URL=http://localhost:8000
  ```

  Start the development server:

  ```bash
  npm run dev
  ```

  Build for production:

  ```bash
  npm run build
  ```

  Lint the codebase:

  ```bash
  npm run lint
  ```

  Preview the production build locally:

  ```bash
  npm run preview
  ```

  ## Routing

  - `/` - landing page
  - `/login` - sign in
  - `/register` - create an account
  - `/scan` - create a new scan
  - `/scan/:id` - scan status page
  - `/dashboard` - scan history and summary metrics
  - `/report/:id` - detailed report view
  - `/settings` - profile and account settings

  ## API Notes

  The frontend talks to the backend through `src/api/client.ts`.

  - Requests use `credentials: 'include'` so HttpOnly auth cookies are sent automatically.
  - Access token refresh is handled transparently by the client.
  - The frontend expects the backend to support the scan, auth, GitHub, and report endpoints used by the UI.

  ## Project Structure

  - `src/pages` - route-level screens
  - `src/components` - shared UI and feature components
  - `src/api` - backend API client
  - `src/store` - shared client state
  - `src/types` - application types and constants
  - `src/effects` - visual effects and background treatments

  ## Notes

  The app is styled with a custom Triskelix visual system and Tailwind utility classes. If you change the backend host or auth behavior, update `VITE_API_URL` and the API client accordingly.
