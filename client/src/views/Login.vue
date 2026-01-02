<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d7a7a] to-[#1a5a5a] p-4 sm:p-6 lg:p-8">
    <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 w-full max-w-sm sm:max-w-md shadow-xl sm:shadow-2xl">
      <div class="text-center mb-6 sm:mb-8">
        <img :src="logo" alt="PHEW Logo" class="h-16 sm:h-20 mx-auto mb-2 object-contain" />
        <p class="text-[#7f8c8d] text-base sm:text-lg">Cafe POS System</p>
      </div>
      <form @submit.prevent="handleLogin" @submit.stop.prevent class="flex flex-col gap-4 sm:gap-6">
        <div v-if="error" class="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg text-sm">{{ error }}</div>
        <div class="flex flex-col gap-1.5 sm:gap-2">
          <label for="username" class="font-medium text-[#2c3e50] text-sm sm:text-base">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full px-3 py-2.5 sm:py-3 border-2 border-[#e0e0e0] rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
            placeholder="Enter your username"
            required
            autocomplete="username"
          />
        </div>
        <div class="flex flex-col gap-1.5 sm:gap-2">
          <label for="password" class="font-medium text-[#2c3e50] text-sm sm:text-base">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2.5 sm:py-3 border-2 border-[#e0e0e0] rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
        </div>
        <button 
          type="button" 
          @click="handleLogin" 
          class="w-full px-4 py-3 sm:py-4 bg-[#2d7a7a] text-white rounded-lg text-base sm:text-lg font-medium hover:bg-[#1a5a5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo.jpeg'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleLogin = async (e) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      
      console.log('Login attempt started', { username: username.value })
      error.value = ''
      loading.value = true
      
      if (!username.value || !password.value) {
        error.value = 'Please enter both username and password'
        loading.value = false
        return
      }
      
      try {
        console.log('Calling authStore.login...')
        const result = await authStore.login(username.value, password.value)
        console.log('Login result:', result)
        
        if (result && result.success) {
          console.log('Login successful, navigating to /')
          // Use replace instead of push to avoid back button issues
          await router.replace('/')
          console.log('Navigation completed')
        } else {
          const errorMsg = result?.error || 'Login failed. Please check your credentials.'
          console.error('Login failed:', errorMsg)
          error.value = errorMsg
        }
      } catch (err) {
        console.error('Login exception:', err)
        error.value = err.message || 'An error occurred during login'
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      error,
      loading,
      handleLogin,
      logo,
    }
  },
}
</script>


