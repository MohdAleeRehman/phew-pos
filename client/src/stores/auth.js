import { defineStore } from 'pinia'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        user = JSON.parse(userStr)
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e)
      localStorage.removeItem('user')
    }
    
    return {
      user,
      token: localStorage.getItem('token') || null,
      loading: false,
      error: null,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isStaff: (state) => state.user?.role === 'staff' || state.user?.role === 'admin',
  },

  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', { username, password })
        
        if (response.data.success && response.data.token) {
          this.token = response.data.token
          this.user = response.data.data
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          return { success: true }
        } else {
          this.error = 'Invalid response from server'
          return { success: false, error: this.error }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Login failed'
        this.error = errorMessage
        console.error('Login error:', error)
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async getMe() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data
        localStorage.setItem('user', JSON.stringify(this.user))
        return response.data.data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

