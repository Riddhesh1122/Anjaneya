# 🚀 Anjaneya — Full-Stack Event Management & AI System

<div align="center">

A modern, scalable Event & Volunteer Management Platform built with React, TypeScript, TailwindCSS, Node.js, Express, and MongoDB.

</div>

---

## 📌 Architecture Overview

Anjaneya is organized as a full-stack monorepo:

```
Anjaneya Root
├── client/                     # Frontend React (Vite, TailwindCSS v4, Framer Motion)
│   ├── src/
│   │   ├── components/         # Reusable UI & AI Modal Components
│   │   ├── contexts/           # AuthContext (JWT & localStorage)
│   │   ├── pages/              # DashboardPage, LoginPage
│   │   └── services/           # aiApi.ts (Proxied via /api/ai)
│   └── vite.config.js          # API proxy (/api -> http://localhost:3001)
│
├── server/                     # Backend API (Express, Mongoose, Zod, JWT)
│   ├── src/
│   │   ├── config/             # Database connection & options
│   │   ├── constants/          # Role definitions & HTTP status codes
│   │   ├── controllers/        # Auth, Event, Volunteer, Task, AI Controllers
│   │   ├── middleware/         # JWT Auth, Role Authorization, Zod Validation
│   │   ├── models/             # User, Event, Volunteer, Task, Booking schemas
│   │   ├── routes/             # REST Endpoints (/api/auth, /api/events, /api/ai, etc.)
│   │   ├── services/           # Business logic & external AI integrations
│   │   └── validators/         # Zod schemas for request bodies/params
│   └── package.json
│
├── .env.example                # Environment template (Port, JWT, Mongo, AI keys)
├── docker-compose.yml          # Local MongoDB container definition
└── package.json                # Root orchestration scripts
```

---

## 👥 Role-Based System

The platform supports role-based access control (`ROLES` constant):

- **Attendee (`attendee`)**: Browse events, view recommendations, register.
- **Student (`student`)**: View registered events, access tickets.
- **Volunteer (`volunteer`)**: View assigned tasks and volunteer schedules.
- **Organizer (`organizer`)**: Create & edit events, run AI skill-matching for volunteers, track analytics.
- **Admin (`admin`)**: Full platform monitoring, user management, and system stats.

---

## 🤖 AI Provider Integration

Server-side proxied route `/api/ai` supports multiple LLM backends configured via environment variables:

- **Gemini**: `AI_PROVIDER=gemini` & `GEMINI_API_KEY`
- **OpenAI**: `AI_PROVIDER=openai` & `OPENAI_API_KEY`
- **Groq**: `AI_PROVIDER=groq` & `GROQ_API_KEY`
- **OpenRouter**: `AI_PROVIDER=openrouter` & `OPENROUTER_API_KEY`
- **Pollinations**: `AI_PROVIDER=pollinations` (Default fallback engine)

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Install Dependencies
Install packages across root, `/client`, and `/server`:
```bash
npm run install:all
```

### 3. Start Development Servers
Start both backend API server (port `3001`) and frontend dashboard (port `5173`):
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```
