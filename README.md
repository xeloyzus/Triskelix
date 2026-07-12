# Triskelix Frontend

This package contains the Triskelix web frontend built with React, TypeScript, Vite, Tailwind CSS, Radix UI primitives, and Zustand.

## Requirements

- Node.js 20 or newer
- npm
- Triskelix backend API

## Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Set the backend API base URL:

```bash
VITE_API_URL=http://localhost:8000
```

If `VITE_API_URL` is omitted, the app uses `http://localhost:8000`.

## Development

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Application Areas

- `src/pages` - route-level screens
- `src/components` - shared UI and feature components
- `src/components/ui` - reusable Radix-style UI primitives
- `src/api` - backend API client
- `src/store` - shared client state
- `src/types` - application types and constants
- `src/effects` - visual effects and background treatments

## Auth And API Behavior

The API client in `src/api/client.ts` sends requests with `credentials: 'include'` so HttpOnly cookies can be used for authentication. When an authenticated request fails, the client attempts token refresh through `/api/auth/refresh` and retries the original request.

The frontend currently expects backend routes for:

- Authentication and profile management
- Scan creation, listing, status, and detail retrieval
- Vulnerability status updates
- Remediation generation and GitHub PR creation
- GitHub authorization and repository listing
- Markdown report and GitHub Actions workflow download
