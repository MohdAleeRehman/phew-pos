import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'POS',
          component: () => import('../views/POS.vue'),
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('../views/Orders.vue'),
        },
        {
          path: 'menu',
          name: 'Menu',
          component: () => import('../views/Menu.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/Reports.vue'),
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: () => import('../views/Inventory.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/Settings.vue'),
          meta: { requiresAdmin: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  // Allow access to login page without auth
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
    return
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router

