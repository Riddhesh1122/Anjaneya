# 🚀 Anjaneya — Event Management System

<div align="center">

A modern, scalable Event Management Platform built with React, TypeScript, and TailwindCSS.

Designed to provide a BookMyShow-like experience for discovering, managing, and participating in events.

</div>

---

## 📌 Overview

**Anjaneya** is a full-stack Event Management System that allows users to discover events, register for events, and manage event workflows based on different user roles.

The platform is designed with a production-ready frontend architecture, allowing easy integration with a backend API in the future.

The project focuses on:

* Clean architecture
* Scalable frontend design
* Role-based experiences
* Responsive UI
* Accessible components
* Future backend compatibility

---

# ✨ Features

## 👥 Role-Based System

The platform supports multiple user roles:

### Guest

* Browse available events
* View event details
* Explore platform features

### Student

* Register for events
* View registered events
* Manage tickets

### Organizer

* Create and manage events
* Track registrations
* View analytics

### Admin

* Manage users
* Manage events
* Monitor platform activity

---

# 🏗️ Architecture

The frontend follows a feature-based architecture.

```
client/src/

├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── features/
│   ├── auth/
│   ├── events/
│   ├── student/
│   ├── organizer/
│   └── admin/
│
├── hooks/
├── layouts/
├── mocks/
├── router/
├── services/
├── types/
└── utils/
```

---

# 🛠️ Tech Stack

## Frontend

| Technology      | Purpose         |
| --------------- | --------------- |
| React           | UI development  |
| TypeScript      | Type safety     |
| TailwindCSS     | Styling         |
| React Router v6 | Routing         |
| React Hook Form | Form management |
| Zod             | Validation      |
| Vite            | Build tooling   |

---

# 🎨 Design System

Anjaneya uses a centralized design token system.

Implemented:

* Colors
* Typography
* Spacing scale
* Shadows
* Theme configuration

Location:

```
src/theme.ts
```

Benefits:

* Consistent UI
* Easier redesign
* Scalable styling

---

# 🌙 Theme System

Supports:

* Light mode
* Dark mode
* System preference

Features:

✅ OS theme detection
✅ Manual toggle
✅ LocalStorage persistence

Flow:

```
User Preference

        ↓

ThemeContext

        ↓

document.documentElement

        ↓

Tailwind dark mode
```

---

# 🔐 Authentication Architecture

Currently uses mock authentication.

Supported roles:

```
GUEST
STUDENT
ORGANIZER
ADMIN
```

Authentication flow:

```
User

 ↓

AuthContext

 ↓

Role Verification

 ↓

Protected Routes

 ↓

Dashboard
```

The architecture is designed to easily replace mock authentication with JWT/session-based authentication later.

---

# 🔌 API Architecture

The application follows a service-based architecture.

Flow:

```
Component

    ↓

Service Layer

    ↓

API Client

    ↓

Mock Data

```

Future backend migration:

```
Current:

apiClient
    |
Mock Data


Future:

apiClient
    |
Backend API
```

Components will not require major changes.

---

# 📂 Development Progress

## Phase 1 — Foundation

Status: 🟢 In Progress

Completed:

✅ Repository analysis
✅ Frontend architecture
✅ Design token system
✅ Authentication Context
✅ Theme Context
✅ Context structure cleanup
✅ TypeScript build verification

In Progress:

⏳ Type definitions
⏳ Mock database
⏳ API service layer
⏳ Form system

---

## Phase 2 — Design System

Planned:

* Button
* Input
* Card
* Modal
* Toast
* Badge
* Loading states
* Error states

---

## Phase 3 — Core User Experience

Planned:

```
Landing Page

        ↓

Explore Events

        ↓

Event Details

        ↓

Registration

        ↓

Dashboard
```

---

# 📱 Planned Features

## Event Discovery

* Search events
* Filter by category
* View event details
* Browse upcoming events

## Event Management

Organizers can:

* Create events
* Edit events
* Manage participants
* View analytics

## Student Experience

Students can:

* Register
* View tickets
* Track events

## Analytics

Dashboard statistics:

* Registrations
* Attendance
* Event performance

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Build Production Version

```bash
npm run build
```

---

# 🧪 Testing

Planned testing stack:

* Jest
* React Testing Library

Testing coverage:

* UI components
* Authentication
* Protected routes
* Forms

---

# 🔮 Future Improvements

Possible additions:

* Real backend integration
* JWT authentication
* Payment gateway
* Email notifications
* QR-based event tickets
* Cloud image storage
* Real-time updates
* Mobile application

---

# 🤝 Contribution

Contributions and suggestions are welcome.

For major changes:

1. Open an issue
2. Discuss proposed changes
3. Submit a pull request

---

# 👨‍💻 Developer

Built as a scalable Event Management Platform project.

---

# 📜 License

This project is currently for educational and development purposes.

