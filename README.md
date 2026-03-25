# HealthHQ - Healthcare Operations SaaS Frontend

A modern React + TypeScript dashboard for healthcare operations teams. HealthHQ combines secure authentication, patient management, analytics, and notification workflows in a responsive web application.

## Highlights

- Firebase Authentication with email/password and Google sign-in.
- Protected application routes with session restore and redirect handling.
- Dashboard with operational metrics, high-priority patient queue, and notification controls.
- Analytics views built with Recharts (department distribution, trend, status mix).
- Patient details workspace with search, filters, sorting, pagination, and grid/list rendering.
- Lightweight list virtualization for desktop patient tables.
- Toast system plus local and push-style browser notifications.
- Theme persistence (light/dark mode) using Zustand storage middleware.
- Service worker registration and notification click routing.

## Tech Stack

- React 19
- TypeScript 5
- Vite 8
- React Router 7
- Zustand 5
- Tailwind CSS 3
- Firebase Web SDK 12
- Recharts 3
- Lucide React

## Product Areas

### 1. Authentication
- Sign up, login, logout, and password reset flows.
- Google OAuth popup login.
- Firebase error normalization for user-friendly messages.
- Graceful behavior when Firebase env variables are missing.

### 2. Dashboard
- KPI cards for patient totals, active/critical counts, and average risk.
- Recent activity and high-priority patient queue.
- Notification operation center:
  - Browser permission state
  - Push subscription status
  - Demo push trigger through service worker messaging

### 3. Analytics
- Department distribution chart.
- Visit trend chart.
- Patient status donut chart.

### 4. Patient Operations
- Mock-backed data service with simulated latency.
- Multi-field search, department/status/gender filtering, sorting, and paging.
- Responsive grid and virtualized desktop table modes.
- Empty, loading, and error states.

## Architecture Overview

The repository follows a clean feature-oriented frontend structure:

- `src/pages`: Route-level pages.
- `src/components`: Reusable UI and feature components (`auth`, `layout`, `patients`, `analytics`, `common`, `ui`).
- `src/store`: Zustand stores (`auth`, `patient`, `ui`, `toast`).
- `src/services`: Firebase setup, patient data service, notification service.
- `src/mock`: Mock patient dataset.
- `src/routes`: Route guards.
- `public/sw.js`: Service worker for push and notification events.

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in Firebase values:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender id |
| `VITE_FIREBASE_APP_ID` | Firebase app id |

Optional for push subscription setup:

| Variable | Description |
| --- | --- |
| `VITE_WEB_PUSH_PUBLIC_KEY` | VAPID public key used for push subscription |

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Notification Behavior

- Service worker is registered on app load.
- Local notifications are shown through the service worker when permission is granted.
- Push subscription requires browser support plus `VITE_WEB_PUSH_PUBLIC_KEY`.
- A simulated push path is included for demo/testing flows.

## Data Model Notes

- Patient data is currently mocked in-memory.
- Data service includes simulated API delay and one deterministic error case (`search === "error"`) to test error UI.
- The structure is ready to swap to a real API by replacing service methods in `src/services/patient.service.ts`.

## Build and Quality

- TypeScript project references (`tsconfig.app.json` + `tsconfig.node.json`).
- ESLint flat config with TypeScript and React hooks rules.
- Tailwind with design tokens via CSS variables for light/dark themes.

## Suggested Next Steps

- Replace mock patient service with backend APIs.
- Add unit/integration tests (Vitest + React Testing Library).
- Add CI checks for lint/build/test.
- Add API-layer auth token propagation and role-based route permissions.

## License

Internal project. Add a license section if this repository will be distributed externally.
