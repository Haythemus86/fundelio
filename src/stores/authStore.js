import { defineStore } from 'pinia'
import { loginUser, registerUser } from '../services/fundelioApi'

const STORAGE_KEY = 'fundelio-auth'

const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const session = loadSession()
    return {
      accessToken: session?.accessToken || '',
      user: session?.user || null,
      isLoading: false,
      error: '',
    }
  },
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken && state.user),
  },
  actions: {
    saveSession(session) {
      this.accessToken = session.accessToken
      this.user = session.user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    },
    async register(payload) {
      this.isLoading = true
      this.error = ''
      try {
        const session = await registerUser(payload)
        this.saveSession(session)
        return session
      } catch (error) {
        this.error = error.response?.data?.message || 'Inscription impossible.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async login(payload) {
      this.isLoading = true
      this.error = ''
      try {
        const session = await loginUser(payload)
        this.saveSession(session)
        return session
      } catch (error) {
        this.error =
          error.response?.data?.message || 'Email ou mot de passe invalide.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.accessToken = ''
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
