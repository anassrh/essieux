import { createClient } from './supabase-client'

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}

// Fonction de connexion
export async function signIn({ email, password }: SignInData) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Fonction d'inscription
export async function signUp({ email, password, fullName }: SignUpData) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Fonction de déconnexion
export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    // Ne pas lancer d'erreur si l'utilisateur n'est pas connecté
    console.warn('Erreur lors de la déconnexion:', error.message)
    return
  }
}

// Fonction pour récupérer l'utilisateur actuel
export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return user
}

// Fonction pour écouter les changements d'authentification
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = createClient()
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as AuthUser || null)
  })
}

// Fonction pour réinitialiser le mot de passe
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Fonction pour mettre à jour le mot de passe
export async function updatePassword(password: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    throw new Error(error.message)
  }
}
