import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const ADMIN_EMAIL = 'yassinnasserr75@gmail.com'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Add your Supabase credentials to .env.local first.')
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  const signOut = () => supabase?.auth.signOut()
  const user = session?.user ?? null
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  return <AuthContext.Provider value={{ user, session, loading, isAdmin, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
