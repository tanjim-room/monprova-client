# Monprova Client - Frontend Application

A modern, responsive React-based frontend for the Monprova healthcare management platform. Built with Vite for fast development and optimized production builds.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Component Architecture](#component-architecture)
- [Custom Hooks](#custom-hooks)
- [Styling](#styling)

## 🎯 Overview

The Monprova client is a comprehensive healthcare management interface serving three main user types:

- **Patients**: Search doctors, book appointments, complete health assessments, manage prescriptions
- **Doctors**: Manage schedules, view patient details, write prescriptions, track consultations
- **Admins**: Manage users, monitor system activity, handle payments, manage content

## ✨ Features

### User Management
- Secure registration and authentication with Firebase
- Role-based access (Patient, Doctor, Admin)
- User profile management
- Password management

### Appointment System
- Doctor search and filtering
- Real-time appointment availability
- Appointment booking and management
- Appointment status tracking

### Health Assessments
- Interactive questionnaires
- Assessment result tracking
- Health recommendations
- Assessment history

### Prescriptions & Health Records
- Prescription viewing and downloading
- PDF generation
- Health record management
- Prescription history

### Payments & Billing
- Secure payment processing
- Invoice management
- Payment history
- Payout management (for doctors)

### Content Management
- Blog articles and health tips
- Educational videos
- Doctor profiles and reviews
- Health resources

### Dashboard & Analytics
- Personalized dashboards
- Statistics and charts
- Activity tracking
- Performance metrics

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite 7 (with Rolldown) |
| **Styling** | Tailwind CSS 3 + DaisyUI 5 |
| **State Management** | React Query (TanStack Query) 5 |
| **Routing** | React Router DOM 7 |
| **HTTP Client** | Axios 1 |
| **Authentication** | Firebase 12 |
| **Form Handling** | React Hook Form 7 |
| **Date Management** | date-fns 4, dayjs 1 |
| **Data Visualization** | Recharts 3 |
| **File Upload** | React Dropzone 14 |
| **UI Components** | DaisyUI, Lucide React, React Icons |
| **Alerts & Modals** | SweetAlert2 11 |

## 📁 Project Structure

```
src/
├── components/              # Reusable components
│   ├── ActionButton.jsx
│   ├── BackButton.jsx
│   ├── Button.jsx
│   ├── Logo.jsx
│   ├── NotificationDropdown.jsx
│   ├── NavBar/             # Navigation components
│   ├── assessment/         # Assessment components
│   └── cards/              # Card components
│
├── pages/                  # Page components (routes)
│   ├── home/
│   ├── login/
│   ├── profile/
│   ├── doctor/
│   ├── appointment/
│   ├── assessment/
│   ├── prescription/
│   ├── admin/
│   ├── patient/
│   ├── blogList/ & blogDetails/
│   └── ...
│
├── layouts/                # Layout components
│   ├── MainLayout.jsx
│   ├── AdminDashboardLayout.jsx
│   ├── DoctorDashboardLayout.jsx
│   └── PatientDashboardLayout.jsx
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.jsx
│   ├── useAxiosPublic.jsx
│   ├── useAxiosSecure.jsx
│   ├── useAppointment.jsx
│   ├── useAssessment.jsx
│   ├── usePrescription.jsx
│   └── ...
│
├── providers/              # Context providers
├── firebase/               # Firebase configuration
├── Routes/                 # Route configuration
├── assets/                 # Static assets
├── App.jsx                 # Main app component
└── main.jsx                # Vite entry point
```

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- Modern web browser
- Firebase project
- Backend server running

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:5000
```

## ⚙️ Configuration

### Vite Configuration (`vite.config.js`)
- Dev server runs on port 5175
- React plugin enabled
- HMR (Hot Module Replacement) configured

### Tailwind Configuration (`tailwind.config.js`)
- DaisyUI theme enabled
- Custom color palette
- Responsive design utilities

## 🛠 Development

### Start Development Server

```bash
npm run dev
```

Access at `http://localhost:5175`

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔨 Building

### Production Build

```bash
npm run build
```

Creates optimized `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🪝 Custom Hooks

All hooks use React Query for efficient data fetching:

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication state |
| `useAxiosPublic` | Public API requests |
| `useAxiosSecure` | Authenticated requests |
| `useAppointment` | Appointment management |
| `useAssessment` | Health assessments |
| `usePrescription` | Prescriptions |
| `useDoctor` | Doctor data |
| `useBlogs` | Blog content |
| `useNotifications` | Notifications |

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **DaisyUI**: Pre-built components
- **Global CSS**: `index.css` and `App.css`

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Vercel

```bash
npm run build
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 💡 Best Practices

1. Keep components small and focused
2. Use custom hooks for API calls
3. Leverage React Query for data management
4. Use Tailwind utilities for styling
5. Implement proper error handling
6. Use semantic HTML

---

For backend setup, see [Server README](../monprova-server/README.md)
