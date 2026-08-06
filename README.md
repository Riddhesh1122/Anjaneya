# 🚀 Anjaneya — Enterprise Event & AI Management System

<div align="center">

A production-ready, full-stack Event Management & Volunteer Automation Platform powered by React 18, TypeScript, TailwindCSS v4, Framer Motion, Node.js, Express, MongoDB, Socket.IO, Nodemailer, and Google Gemini AI.

</div>

---

## 📌 Features & Architecture Overview

Anjaneya is designed as a high-performance, modular full-stack monorepo:

### 1. 📊 Analytics Dashboard Suite (No Graphs)
- 12 SaaS metric cards grid, status badges (`Good`, `Warning`, `Critical`), Quick Insights, and Severity Smart Alerts.
- Multi-format data table exporter supporting **CSV**, **Excel (.xls)**, and **PDF (Printable Reports)**.

### 2. 🔐 Secure QR Code Pass & Attendance System
- HMAC SHA-256 signed QR JWT tokens with DB attendance tracking (`scannedBy`, `isCertificateEligible`).
- Camera scanner page and ticket pass modal.

### 3. 👥 Team Registration System
- MongoDB Team schema, 6-character unique invite codes (`TEAM-XXXX`), team leader permissions (remove member, submit final registration), and organizer team review panel.

### 4. 📅 Advanced Event Discovery & Calendar Hub
- Debounced global search bar, quick filter chips (`Today`, `AI Events`, `Free Events`), multi-criteria filters (Category, Format, Pricing, Status), sorting selector, and interactive Monthly/Weekly/Daily Calendar view.

### 5. ⚙️ Settings, Profile & Admin Audit Logs
- 85% Profile completion counter, avatar upload, password change, notification toggles, active sessions, and immutable security audit log stream with CSV/Excel/PDF export toolbar.

### 6. 📧 Non-Blocking Email Notification System
- Nodemailer SMTP dispatcher with 8 responsive HTML email templates, fallback dev logger driver, and non-blocking `setImmediate()` background execution.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS v4, Framer Motion, Lucide Icons, html2canvas, jspdf
- **Backend**: Node.js, Express, Mongoose (MongoDB), Socket.IO, Nodemailer, Zod, JWT
- **AI Engine**: Server-proxied Google Gemini AI (`/api/ai`) with word-by-word streaming

---

## 🚀 Environment Variables (`.env`)

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/anjaneya
JWT_SECRET=your_jwt_secret_key
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

---

## 💻 Running Locally

### Backend Server:
```powershell
powershell -ExecutionPolicy Bypass -Command "cd server; npm run dev"
```

### Frontend Server:
```powershell
powershell -ExecutionPolicy Bypass -Command "cd client; node node_modules/vite/bin/vite.js --host"
```

---

## 📦 Production Build Verification

```powershell
powershell -ExecutionPolicy Bypass -Command "cd client; npm run build"
```
*Target: 0 TypeScript errors, 0 compilation warnings (~280ms build time).*
