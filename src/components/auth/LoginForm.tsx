'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import EMSILogoSimple from '@/components/ui/EMSILogoSimple'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { signOut } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn({ email, password })
      } else {
        await signUp({ email, password, fullName })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex">
        {/* Left Panel - Welcome Section */}
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-pink-500 relative p-12 flex flex-col justify-center">
          {/* Decorative Shapes */}
          <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl transform rotate-12 opacity-80"></div>
          <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl transform -rotate-12 opacity-70"></div>
          <div className="absolute top-40 left-8 w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg transform rotate-45 opacity-60"></div>
          <div className="absolute bottom-20 left-12 w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl transform -rotate-6 opacity-75"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* EMSI Logo */}
            <div className="mb-8 flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <EMSILogoSimple size="md" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Welcome to Essieux
            </h1>
            <p className="text-white text-lg leading-relaxed opacity-90 max-w-md">
              Gestion complète de votre parc d'essieux avec suivi des révisions, maintenance et équipe technique.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-96 p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-purple-600 text-center mb-8">
              USER LOGIN
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl bg-purple-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                    placeholder="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl bg-purple-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl bg-purple-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? 'Chargement...' : 'LOGIN'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
              >
                {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
        designed by <span className="font-semibold">essieux team</span>
      </div>
    </div>
  )
}
