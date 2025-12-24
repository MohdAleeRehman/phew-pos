<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
      <h1>Orders</h1>
      <div class="flex gap-4 flex-wrap">
        <input
          v-model="filters.startDate"
          type="date"
          class="w-auto min-w-[150px] px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
          placeholder="Start Date"
        />
        <input
          v-model="filters.endDate"
          type="date"
          class="w-auto min-w-[150px] px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
          placeholder="End Date"
        />
        <select v-model="filters.status" class="w-auto min-w-[150px] px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button 
          @click="fetchOrders" 
          class="px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
        >
          Filter
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">Loading orders...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">{{ error }}</div>
    <div v-else class="flex flex-col gap-6">
      <div v-for="order in orders" :key="order._id" class="bg-white rounded-xl p-6 shadow-md">
        <div class="flex justify-between items-start mb-4 pb-4 border-b-2 border-[#e0e0e0]">
          <div>
            <h3>{{ order.orderNumber }}</h3>
            <p class="text-[#7f8c8d] text-sm mt-2 capitalize">
              {{ new Date(order.createdAt).toLocaleString() }} • {{ order.orderType }} • {{ order.paymentMethod }}
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                order.status === 'pending' ? 'bg-[#f39c12] text-white' : '',
                order.status === 'completed' ? 'bg-[#27ae60] text-white' : '',
                order.status === 'cancelled' ? 'bg-[#e74c3c] text-white' : ''
              ]"
            >
              {{ order.status }}
            </span>
            <span class="text-xl font-bold text-[#2d7a7a]">PKR {{ order.total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="mb-4">
          <div v-for="(item, index) in order.items" :key="index" class="flex justify-between py-2 border-b border-[#e0e0e0] last:border-b-0">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>PKR {{ item.subtotal.toFixed(2) }}</span>
          </div>
        </div>
        <div class="pt-4 border-t-2 border-[#e0e0e0]">
          <div class="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>PKR {{ order.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="order.discountAmount > 0" class="flex justify-between py-1">
            <span>Discount:</span>
            <span>-PKR {{ order.discountAmount.toFixed(2) }}</span>
          </div>
          <div v-if="order.taxAmount > 0" class="flex justify-between py-1">
            <span>GST ({{ (order.taxRate * 100).toFixed(0) }}%):</span>
            <span>PKR {{ order.taxAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between py-2 text-lg font-bold text-[#2d7a7a] mt-2 pt-2 border-t border-[#e0e0e0]">
            <span>Total:</span>
            <span>PKR {{ order.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

export default {
  name: 'Orders',
  setup() {
    const orders = ref([])
    const loading = ref(false)
    const error = ref('')
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

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      filters,
      fetchOrders,
    }
  },
}
</script>
