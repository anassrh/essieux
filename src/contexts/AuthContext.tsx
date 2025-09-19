'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, onAuthStateChange } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      const { signOut: authSignOut } = await import('@/lib/auth')
      await authSignOut()
      setUser(null)
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error)
      // Forcer la déconnexion locale même en cas d'erreur
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
