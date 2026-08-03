import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import { Placeholder } from './pages/Placeholder';
import AuthPage from './pages/AuthPage'
import EventDetailPage from './pages/EventDetailPage'
import MyTicketsPage from './pages/MyTicketsPage'
import CreateEventPage from './pages/CreateEventPage'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard.tsx';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard.tsx';
import AttendeeDashboard from './pages/attendee/AttendeeDashboard.tsx';
import ProtectedRoute from './router/ProtectedRoute'
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import EventsPage from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventsCreate from './pages/EventsCreate';
import EventEdit from './pages/EventEdit';
import VolunteersPage from './pages/Volunteers';
import VolunteerProfile from './pages/VolunteerProfile';
import TasksPage from './pages/Tasks';
import TaskCreate from './pages/TaskCreate';
import TaskDetails from './pages/TaskDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Events module */}
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/create" element={<EventsCreate />} />
      <Route path="/events/edit/:id" element={<EventEdit />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Volunteers & Tasks */}
      <Route path="/volunteers" element={<VolunteersPage />} />
      <Route path="/volunteers/:id" element={<VolunteerProfile />} />

      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/create" element={<TaskCreate />} />
      <Route path="/tasks/:id" element={<TaskDetails />} />

      <Route path="/tickets" element={<MyTicketsPage />} />
      <Route path="/organizer/create-event" element={<CreateEventPage />} />
      <Route path="/placeholder" element={<Placeholder />} />
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
