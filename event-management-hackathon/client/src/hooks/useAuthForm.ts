import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import type { AuthRole } from '../types/auth'

export function useAuthForm() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState<AuthRole>('attendee')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [college, setCollege] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        await register({
          name: name || email.split('@')[0],
          email,
          password,
          college,
          role,
        })
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const roleLabel =
    role === 'attendee'
      ? 'Attendee'
      : role === 'organizer'
      ? 'Organizer'
      : role === 'volunteer'
      ? 'Volunteer'
      : 'Admin'

  return {
    isSignUp,
    setIsSignUp,
    role,
    setRole,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    college,
    setCollege,
    error,
    loading,
    handleSubmit,
    roleLabel,
  }
}
