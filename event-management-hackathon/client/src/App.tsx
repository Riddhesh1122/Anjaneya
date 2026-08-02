import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import { Placeholder } from './pages/Placeholder';
import AuthPage from './pages/AuthPage'
import EventDetailPage from './pages/EventDetailPage'
import MyTicketsPage from './pages/MyTicketsPage'
import CreateEventPage from './pages/CreateEventPage'
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard.tsx";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard.tsx";
import AttendeeDashboard from "./pages/attendee/AttendeeDashboard.tsx";
import ProtectedRoute from './router/ProtectedRoute'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/organizer/create-event" element={<CreateEventPage />} />
        {/* Role‑based dashboards */}
        <Route
          path="/organizer/*"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/*"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/*"
          element={
            <ProtectedRoute allowedRoles={['attendee']}>
              <AttendeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
  )
}
