<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c3e50]">Reports & Analytics</h1>
      
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
        <button 
          @click="fetchReports" 
          class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8 text-sm sm:text-base">Loading reports...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{{ error }}</div>
    <div v-else class="flex flex-col gap-4 sm:gap-6">
      <!-- Sales Summary -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">Sales Summary</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div class="flex flex-col gap-1 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Total Sales</span>
            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalSales?.toFixed(0) || '0' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Total Orders</span>
            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d7a7a]">{{ salesSummary.totalOrders || 0 }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Avg Order</span>
            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.averageOrderValue?.toFixed(0) || '0' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Total Tax</span>
            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalTax?.toFixed(0) || '0' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg col-span-2 sm:col-span-1">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Total Discount</span>
            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalDiscount?.toFixed(0) || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">Payment Breakdown</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="method in paymentBreakdown"
            :key="method.method"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-sm sm:text-base text-[#2c3e50]">{{ method.method.replace('-', ' ').toUpperCase() }}</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">{{ method.count }} orders</span>
            </div>
            <div class="flex flex-col sm:items-end gap-0.5">
              <span class="text-lg sm:text-xl font-bold text-[#2d7a7a]">PKR {{ method.total.toFixed(0) }}</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">({{ method.percentage.toFixed(1) }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Summary -->
      <div v-if="taxBreakdown" class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">GST Tax Summary</h2>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-sm sm:text-base text-[#2c3e50]">Cash (16% GST)</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">Rate: 16%</span>
            </div>
            <span class="text-lg sm:text-xl font-bold text-[#2d7a7a]">PKR {{ taxBreakdown.cash?.taxCollected?.toFixed(0) || '0' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg">
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-sm sm:text-base text-[#2c3e50]">Card (5% GST)</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">Rate: 5%</span>
            </div>
            <span class="text-lg sm:text-xl font-bold text-[#2d7a7a]">PKR {{ taxBreakdown.card?.taxCollected?.toFixed(0) || '0' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-[#2d7a7a] text-white rounded-lg font-bold">
            <span class="text-sm sm:text-base">Total GST Collected</span>
            <span class="text-lg sm:text-xl">PKR {{ taxBreakdown.totalGST?.toFixed(0) || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- Top Selling Items -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">Top Selling Items</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, index) in topItems"
            :key="item.menuItem?._id || index"
            class="flex items-center gap-3 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#2d7a7a] text-white rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
              #{{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm sm:text-base truncate">{{ item.name }}</h3>
              <p class="text-[#7f8c8d] text-xs sm:text-sm">
                {{ item.quantity }} sold • PKR {{ item.revenue.toFixed(0) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Sales -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">Category Sales</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="(category, index) in categorySales"
            :key="category.category || index"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-sm sm:text-base lg:text-lg text-[#2c3e50]">{{ category.category }}</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">{{ category.itemCount }} different items</span>
            </div>
            <div class="flex flex-col sm:items-end gap-0.5">
              <span class="text-base sm:text-lg lg:text-xl font-bold text-[#2d7a7a]">{{ category.quantity }} sold</span>
              <span class="text-xs sm:text-sm text-[#7f8c8d]">PKR {{ category.revenue.toFixed(0) }} revenue</span>
            </div>
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
  name: 'Reports',
  setup() {
    const loading = ref(false)
    const error = ref('')
    const filters = ref({
      startDate: '',
      endDate: '',
    })
    const salesSummary = ref({})
    const paymentBreakdown = ref([])
    const taxBreakdown = ref(null)
    const topItems = ref([])
    const categorySales = ref([])

    const fetchReports = async () => {
      loading.value = true
      error.value = ''
      try {
        const params = {}
        if (filters.value.startDate) params.startDate = filters.value.startDate
        if (filters.value.endDate) params.endDate = filters.value.endDate

        // Fetch all reports in parallel
        const [salesRes, paymentRes, itemsRes, categoryRes] = await Promise.all([
          api.get('/reports/daily-sales', { params }),
          api.get('/reports/payment-breakdown', { params }),
          api.get('/reports/top-items', { params: { ...params, limit: 10 } }),
          api.get('/reports/category-sales', { params }),
        ])

        salesSummary.value = salesRes.data.data.summary || {}
        paymentBreakdown.value = paymentRes.data.data.breakdown || []
        taxBreakdown.value = salesRes.data.data.taxBreakdown || paymentRes.data.data.taxBreakdown || null
        topItems.value = itemsRes.data.data || []
        categorySales.value = categoryRes.data.data || []
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch reports'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchReports()
    })

    return {
      loading,
      error,
      filters,
      salesSummary,
      paymentBreakdown,
      taxBreakdown,
      topItems,
      categorySales,
      fetchReports,
    }
  },
}
</script>
