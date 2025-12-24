import axios from 'axios'

// Use environment variable for API URL, fallback to /api for development/production
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    // Remove trailing slash if present and ensure it ends with /api
    let url = import.meta.env.VITE_API_URL.trim()
    if (url.endsWith('/')) {
      url = url.slice(0, -1)
    }
    // If URL doesn't end with /api, add it
    if (!url.endsWith('/api')) {
      url = url.endsWith('/') ? url + 'api' : url + '/api'
    }
    return url
  }
  // In production without VITE_API_URL, use /api (will be proxied by Vercel if configured)
  // In development, use /api (proxied by Vite)
  return '/api'
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Use router if available, otherwise use window.location
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
