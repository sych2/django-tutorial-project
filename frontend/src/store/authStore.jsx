import { useState, useEffect, createContext, useContext } from 'react'
import api from '../services/api'
import axios from 'axios'

const AuthContext = createContext(null)

const BASE_URL = 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [tokens, setTokensState] = useState({
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('/api/auth/profile/')
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const { data } = await api.post('/api/auth/login/', { username, password })
    localStorage.setItem('access_token', data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    setTokensState({ access: data.tokens.access, refresh: data.tokens.refresh })
    setUser(data.user)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await api.post('/api/auth/register/', formData)
    localStorage.setItem('access_token', data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    setTokensState({ access: data.tokens.access, refresh: data.tokens.refresh })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      await api.post('/api/auth/logout/', { refresh })
    } finally {
      localStorage.clear()
      setUser(null)
      setTokensState({ access: null, refresh: null })
    }
  }

  // Called by GoogleCallback after OAuth completes
  const setTokens = (access, refresh) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setTokensState({ access, refresh })
  }

  // Navigate to Django admin by first creating a session via JWT bridge
  const goToAdmin = async () => {
    const access = localStorage.getItem('access_token')
    if (!access) return

    try {
      await axios.post(
        `${BASE_URL}/api/auth/admin-session/`,
        { access },
        { withCredentials: true }
      )
      window.location.href = `${BASE_URL}/admin/`
    } catch (err) {
      console.error('Admin session creation failed:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      tokens,
      login,
      register,
      logout,
      setUser,
      setTokens,
      goToAdmin,       // ✅ use this wherever you have an admin panel link
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
