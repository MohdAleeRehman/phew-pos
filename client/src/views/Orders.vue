<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c3e50]">Orders</h1>
      
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:flex-wrap sm:items-center">
        <input
          v-model="filters.startDate"
          type="date"
          class="w-full sm:w-auto px-3 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]"
          placeholder="Start Date"
        />
        <input
          v-model="filters.endDate"
          type="date"
          class="w-full sm:w-auto px-3 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]"
          placeholder="End Date"
        />
        <select v-model="filters.status" class="w-full sm:w-auto px-3 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button 
          @click="fetchOrders" 
          class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
        >
          Filter
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8 text-sm sm:text-base">Loading orders...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{{ error }}</div>
    <div v-else class="flex flex-col gap-3 sm:gap-4">
      <div v-for="order in orders" :key="order._id" class="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm sm:shadow-md">
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 pb-3 border-b-2 border-[#e0e0e0]">
          <div class="flex-1">
            <h3 class="text-base sm:text-lg lg:text-xl font-bold">{{ order.orderNumber }}</h3>
            <p class="text-[#7f8c8d] text-xs sm:text-sm mt-1 capitalize">
              {{ new Date(order.createdAt).toLocaleString() }}
            </p>
            <p class="text-[#7f8c8d] text-xs sm:text-sm capitalize">
              {{ order.orderType }} • {{ order.paymentMethod }}
            </p>
          </div>
          <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div class="flex items-center gap-2">
              <span 
                :class="[
                  'px-2 sm:px-3 py-1 rounded-full text-xs font-semibold capitalize',
                  order.status === 'pending' ? 'bg-[#f39c12] text-white' : '',
                  order.status === 'completed' ? 'bg-[#27ae60] text-white' : '',
                  order.status === 'cancelled' ? 'bg-[#e74c3c] text-white' : ''
                ]"
              >
                {{ order.status }}
              </span>
              <button
                v-if="isAdmin"
                @click="deleteOrder(order._id)"
                :disabled="deleting === order._id"
                class="px-2 sm:px-3 py-1 rounded-lg text-xs font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all disabled:opacity-50"
              >
                {{ deleting === order._id ? '...' : 'Delete' }}
              </button>
            </div>
            <span class="text-lg sm:text-xl font-bold text-[#2d7a7a]">PKR {{ order.total.toFixed(0) }}</span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-3">
          <div v-for="(item, index) in order.items" :key="index" class="flex justify-between py-1.5 sm:py-2 border-b border-[#e0e0e0] last:border-b-0 text-xs sm:text-sm">
            <span class="flex-1">{{ item.name }} × {{ item.quantity }}</span>
            <span class="font-medium">PKR {{ item.subtotal.toFixed(0) }}</span>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="pt-3 border-t-2 border-[#e0e0e0] text-xs sm:text-sm">
          <div class="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>PKR {{ order.subtotal.toFixed(0) }}</span>
          </div>
          <div v-if="order.discountAmount > 0" class="flex justify-between py-1 text-[#e74c3c]">
            <span>Discount:</span>
            <span>-PKR {{ order.discountAmount.toFixed(0) }}</span>
          </div>
          <div v-if="order.taxAmount > 0" class="flex justify-between py-1">
            <span>GST ({{ (order.taxRate * 100).toFixed(0) }}%):</span>
            <span>PKR {{ order.taxAmount.toFixed(0) }}</span>
          </div>
          <div class="flex justify-between py-2 text-base sm:text-lg font-bold text-[#2d7a7a] mt-1 pt-2 border-t border-[#e0e0e0]">
            <span>Total:</span>
            <span>PKR {{ order.total.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api/axios'

export default {
  name: 'Orders',
  setup() {
    const authStore = useAuthStore()
    const isAdmin = computed(() => authStore.isAdmin)
    const orders = ref([])
    const loading = ref(false)
    const error = ref('')
    const deleting = ref(null)
    const filters = ref({
      startDate: '',
      endDate: '',
      status: '',
    })

    const fetchOrders = async () => {
      loading.value = true
      error.value = ''
      try {
        const params = {}
        if (filters.value.startDate) params.startDate = filters.value.startDate
        if (filters.value.endDate) params.endDate = filters.value.endDate
        if (filters.value.status) params.status = filters.value.status

        const response = await api.get('/orders', { params })
        orders.value = response.data.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch orders'
      } finally {
        loading.value = false
      }
    }

    const deleteOrder = async (orderId) => {
      if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return
      }

      deleting.value = orderId
      try {
        await api.delete(`/orders/${orderId}`)
        await fetchOrders()
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete order')
      } finally {
        deleting.value = null
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      filters,
      fetchOrders,
      deleteOrder,
      deleting,
      isAdmin,
    }
  },
}
</script>
