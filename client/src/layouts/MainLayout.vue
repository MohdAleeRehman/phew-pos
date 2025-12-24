<template>
  <div class="flex min-h-screen">
    <aside class="w-62.5 bg-[#1a5a5a] text-white flex flex-col shadow-lg">
      <div class="p-8 px-6 border-b border-white/10">
        <img :src="logo" alt="PHEW Logo" class="h-20 mb-2 object-contain rounded-lg" />
        <p class="text-sm opacity-90 capitalize">{{ user?.name }} ({{ user?.role }})</p>
      </div>
      <nav class="flex-1 py-4">
        <router-link 
          to="/" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>🛒</span> POS
        </router-link>
        <router-link 
          to="/orders" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>📋</span> Orders
        </router-link>
        <router-link 
          to="/reports" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>📊</span> Reports
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/menu"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>🍽️</span> Menu
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/inventory"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>📦</span> Inventory
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/settings"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
        >
          <span>⚙️</span> Settings
        </router-link>
        <button 
          @click="handleLogout" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10 border-none bg-transparent mt-auto border-t border-white/10"
        >
          <span>🚪</span> Logout
        </button>
      </nav>
    </aside>
    <main class="flex-1 overflow-y-auto bg-[#f5f5f5]">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo.jpeg'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const isAdmin = computed(() => authStore.isAdmin)

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      user,
      isAdmin,
      handleLogout,
      logo,
    }
  },
}
</script>


