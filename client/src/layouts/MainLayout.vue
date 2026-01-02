<template>
  <div class="flex min-h-screen relative">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#1a5a5a] text-white flex items-center justify-between px-4 z-40 shadow-md">
      <button 
        @click="sidebarOpen = !sidebarOpen" 
        class="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="flex items-center gap-2">
        <img :src="logo" alt="PHEW Logo" class="h-8 object-contain rounded" />
        <span class="font-semibold text-sm">PHEW POS</span>
      </div>
      <div class="w-10"></div>
    </header>

    <!-- Overlay for mobile -->
    <div 
      v-if="sidebarOpen" 
      class="lg:hidden fixed inset-0 bg-black/50 z-40"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a5a5a] text-white flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-6 border-b border-white/10">
        <img :src="logo" alt="PHEW Logo" class="h-16 lg:h-20 mb-2 object-contain rounded-lg" />
        <p class="text-sm opacity-90 capitalize truncate">{{ user?.name }} ({{ user?.role }})</p>
      </div>
      <nav class="flex-1 py-4 overflow-y-auto">
        <router-link 
          to="/" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
        >
          <span>🛒</span> POS
        </router-link>
        <router-link 
          to="/orders" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
        >
          <span>📋</span> Orders
        </router-link>
        <router-link 
          to="/reports" 
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
        >
          <span>📊</span> Reports
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/menu"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
        >
          <span>🍽️</span> Menu
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/inventory"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
        >
          <span>📦</span> Inventory
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/settings"
          class="flex items-center gap-3 px-6 py-4 text-white no-underline transition-all w-full text-left text-base cursor-pointer hover:bg-white/10"
          active-class="bg-[#2d7a7a] border-l-4 border-[#ff6b35]"
          @click="closeSidebarOnMobile"
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

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-[#f5f5f5] pt-14 lg:pt-0 min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo.jpeg'

export default {
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const sidebarOpen = ref(false)

    const user = computed(() => authStore.user)
    const isAdmin = computed(() => authStore.isAdmin)

    const handleLogout = () => {
      sidebarOpen.value = false
      authStore.logout()
      router.push('/login')
    }

    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false
      }
    }

    // Close sidebar on route change for mobile
    watch(() => route.path, () => {
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false
      }
    })

    return {
      user,
      isAdmin,
      handleLogout,
      logo,
      sidebarOpen,
      closeSidebarOnMobile,
    }
  },
}
</script>


