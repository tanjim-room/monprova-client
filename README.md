# Monprova Client - Mental-Healthcare Web Frontend

The official web frontend for **Monprova (মনপ্রভা)**, a mental-health and telemedicine
healthcare platform. This React single-page application (SPA) lets patients book
appointments with doctors, complete health assessments, view prescriptions, make
payments, and read educational resources — while doctors and admins manage their
dashboards.

> This app is the client for the [Monprova Server](../monprova-server/README.md).
> It talks to the backend REST API for all data and uses Firebase for
> authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Client](#running-the-client)
- [Building for Production](#building-for-production)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Firebase Setup](#firebase-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Monprova client is a role-aware healthcare web app with three main user
surfaces:

- **Patients** — register/login, find doctors, book appointments, complete
  self-assessments, view prescriptions, pay for consultations, read blogs/videos,
  and use relaxation games.
- **Doctors** — manage profile, schedule, appointments, create prescriptions, and
  track income/payouts.
- **Admins** — verify doctors, manage users, handle complaints, oversee
  appointments, and publish resources.

Authentication is handled by **Firebase** (email/password and Google sign-in).
After sign-in, the client exchanges the Firebase user for a backend JWT stored in
`localStorage` as `access-token`, which is then sent to the Monprova API.

## ✨ Features

- ✅ Firebase email/password and Google authentication
- ✅ JWT-secured API calls via axios interceptors
- ✅ Role-based routing (Patient / Doctor / Admin) with private routes
- ✅ Patient appointment booking and doctor scheduling
- ✅ Health assessments with charts (Recharts)
- ✅ Prescription viewing and PDF generation/print
- ✅ Payment success/error flows
- ✅ Blogs, videos, and educational resources
- ✅ Relaxation games (breathing exercise, coloring, etc.)
- ✅ Responsive UI with Tailwind CSS + DaisyUI
- ✅ Data fetching/caching with TanStack React Query

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite (rolldown-vite) |
| **Routing** | React Router 7 |
| **Language** | JavaScript (JSX) |
| **Styling** | Tailwind CSS 3, DaisyUI 5 |
| **State / Data** | TanStack React Query 5 |
| **Auth** | Firebase 12 |
| **HTTP** | Axios |
| **Forms** | React Hook Form |
| **Charts** | Recharts |
| **Dates** | Day.js, date-fns, react-datepicker |
| **Icons** | lucide-react, react-icons |
| **Notifications** | SweetAlert2 |
| **Linting** | ESLint 9 |

## 📁 Project Structure

```
monprova-client/
├── index.html                  # HTML shell (title: মনপ্রভা)
├── vite.config.js              # Vite config (dev server port 5175)
├── tailwind.config.js          # Tailwind + DaisyUI
├── postcss.config.js
├── eslint.config.js
├── firebase.json               # Firebase Hosting config (serves /dist)
├── package.json
│
└── src/
    ├── main.jsx                # App entry: Auth + QueryClient + Router + Helmet
    ├── App.jsx                 # Default Vite template (unused demo component)
    ├── httpservice.js          # Axios response interceptor
    │
    ├── firebase/
    │   └── firebase.config.js  # Firebase init from env vars
    │
    ├── providers/
    │   └── AuthProvider.jsx    # Firebase auth context + JWT exchange
    │
    ├── hooks/                  # Custom data hooks + axios instances
    │   ├── useAxiosPublic.jsx  # Public axios (VITE_API_BASE_URL)
    │   ├── useAxiosSecure.jsx  # Secure axios (VITE_API_BASE_URL)
    │   ├── useAuth.jsx         # Auth context consumer
    │   ├── useUser.jsx, useDoctor.jsx, useAppointment.jsx, ...
    │
    ├── Routes/
    │   ├── Routes.jsx          # All app routes
    │   └── PrivateRoute.jsx    # Route guard
    │
    ├── layouts/                # MainLayout, Patient/Doctor/Admin dashboards
    ├── pages/                  # Home, login, signup, dashboards, assessments...
    ├── components/             # NavBar, cards, buttons, assessment, etc.
    └── assets/                 # Static assets
```

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** (bundled with Node)
- A running instance of the [Monprova Server](../monprova-server/README.md)
- A **Firebase** project (for authentication)

## 🚀 Installation

```bash
# From the monprova-client directory
npm install
```

> The project pins `vite` to the `rolldown-vite` build via `overrides` in
> `package.json`. A normal `npm install` will resolve this automatically.

## 🔐 Environment Variables

Create a `.env` file in the `monprova-client` root:

```env
# Backend API base URL (must match the server's CORS origin)
VITE_API_BASE_URL=http://localhost:5000

# Firebase web app configuration
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_project.appspot.com
VITE_messagingSenderId=your_messaging_sender_id
VITE_appId=your_firebase_app_id
```

These are read in `src/firebase/firebase.config.js` and
`src/hooks/useAxiosPublic.jsx` / `useAxiosSecure.jsx` via `import.meta.env`.

## 🏃 Running the Client

The dev server is configured to run on port **5175** (to match the backend CORS
allowlist, which defaults to `http://localhost:5175`):

```bash
npm run dev
```

Open http://localhost:5175 in your browser.

## 🏗 Building for Production

```bash
npm run build
```

Output is written to the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

## 🔗 Connecting to the Backend

1. Start the [Monprova Server](../monprova-server/README.md) (default port 5000).
2. Ensure `VITE_API_BASE_URL` points at the server (e.g. `http://localhost:5000`).
3. In the server's `.env`, set `CORS_ORIGIN=http://localhost:5175` so requests
   from the client are accepted.

On login, `AuthProvider` posts the Firebase user email to `POST /api/jwt` to
receive a backend JWT, which it stores as `access-token` in `localStorage`.

## 🔥 Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a
   project.
2. Add a **Web App** and copy its config values into the `.env` variables above.
3. Enable **Authentication → Sign-in method**:
   - Email/Password
   - Google
4. (Optional) For hosting, the included `firebase.json` serves the `dist` build
   with SPA rewrites to `index.html`.

## 🧪 Testing

End-to-end tests for the app live in the repository root `tests/` (Playwright) and
target the running client. From the repo root:

```bash
npm install      # installs playwright + csv-parser at the workspace root
npx playwright test
```

Common test specs:

- `tests/login.spec.js`
- `tests/register.spec.js`

Make sure the client dev server and backend are running before executing tests.

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy
```

The `firebase.json` already maps the `dist` directory and rewrites all routes to
`index.html`.

### Netlify / Vercel / Any Static Host

1. Build with `npm run build`.
2. Deploy the `dist/` folder.
3. Add a **SPA rewrite** so all paths serve `index.html` (needed for React Router).
4. Set the environment variables from the [Environment Variables](#environment-variables)
   section in the host's dashboard.

## ⚠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS errors from the API | Confirm `CORS_ORIGIN` on the server matches `http://localhost:5175` (or your deployed URL) and that `VITE_API_BASE_URL` is correct. |
| Firebase "auth/invalid-api-key" | Double-check all `VITE_*` Firebase env values. |
| `access-token` never set | Ensure the server exposes `POST /api/jwt` and is reachable from the client. |
| Blank page after deploy | Add an SPA rewrite to `index.html` on the static host. |
| Port already in use | `vite.config.js` fixes the port to `5175`; change it or stop the conflicting process. |

## 💡 Notes for Contributors

- `src/App.jsx` is still the default Vite starter component and is not used by the
  router — the real app boots from `src/main.jsx` → `Routes/Routes.jsx`.
- API access should go through `useAxiosPublic` (no token) or `useAxiosSecure`
  (token attached) rather than raw `axios`.
- Data-fetching logic is centralized in `src/hooks/` (e.g. `useAppointment`,
  `useDoctor`, `usePrescription`).

---

For backend setup and API details, see the [Server README](../monprova-server/README.md).
