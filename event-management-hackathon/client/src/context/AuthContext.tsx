import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthRole } from '../types/auth'

export interface User {
  _id: string
  name: string
  email: string
  role: AuthRole
  college?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name?: string; email: string; password: string; college?: string; role?: AuthRole }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const text = await res.text()
        const userData = text ? JSON.parse(text) : null

        if (res.ok && userData) {
          setUser(userData)
        } else {
          localStorage.removeItem('token')
          setToken(null)
        }
      } catch (err) {
        console.error('Failed to restore session:', err)
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch (e) {
      console.error('Failed to parse login response JSON', e)
    }

    if (!res.ok) {
      throw new Error((data && data.message) || 'Login failed')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }

  const register = async (userData: { name?: string; email: string; password: string; college?: string; role?: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch (e) {
      console.error('Failed to parse registration response JSON', e)
    }

    if (!res.ok) {
      throw new Error((data && data.message) || 'Registration failed')
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
