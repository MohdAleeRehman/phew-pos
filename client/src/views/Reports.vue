<template>
  <div class="p-4 md:p-8">
    <div class="flex justify-between items-center mb-6 md:mb-8 flex-wrap gap-4">
      <h1 class="text-2xl md:text-3xl font-bold text-[#2c3e50]">Reports & Analytics</h1>
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
        <button 
          @click="fetchReports" 
          class="px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">Loading reports...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">{{ error }}</div>
    <div v-else class="flex flex-col gap-8">
      <!-- Daily Sales Summary -->
      <div class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6 text-[#2c3e50]">Sales Summary</h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          <div class="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-sm">Total Sales</span>
            <span class="text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalSales?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-sm">Total Orders</span>
            <span class="text-2xl font-bold text-[#2d7a7a]">{{ salesSummary.totalOrders || 0 }}</span>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-sm">Average Order Value</span>
            <span class="text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.averageOrderValue?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-sm">Total Tax</span>
            <span class="text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalTax?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
            <span class="text-[#7f8c8d] text-sm">Total Discount</span>
            <span class="text-2xl font-bold text-[#2d7a7a]">PKR {{ salesSummary.totalDiscount?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown -->
      <div class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6 text-[#2c3e50]">Payment Method Breakdown</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="method in paymentBreakdown"
            :key="method.method"
            class="flex justify-between items-center p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-[#2c3e50]">{{ method.method.replace('-', ' ').toUpperCase() }}</span>
              <span class="text-sm text-[#7f8c8d]">{{ method.count }} orders</span>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-xl font-bold text-[#2d7a7a]">PKR {{ method.total.toFixed(2) }}</span>
              <span class="text-sm text-[#7f8c8d]">({{ method.percentage.toFixed(1) }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Breakdown (GST Summary) -->
      <div v-if="taxBreakdown" class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6 text-[#2c3e50]">GST Tax Summary</h2>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center p-4 bg-[#f5f5f5] rounded-lg">
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-[#2c3e50]">Cash (18% GST)</span>
              <span class="text-sm text-[#7f8c8d]">Rate: 18%</span>
            </div>
            <div>
              <span class="text-xl font-bold text-[#2d7a7a]">PKR {{ taxBreakdown.cash?.taxCollected?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center p-4 bg-[#f5f5f5] rounded-lg">
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-[#2c3e50]">Card (5% GST)</span>
              <span class="text-sm text-[#7f8c8d]">Rate: 5%</span>
            </div>
            <div>
              <span class="text-xl font-bold text-[#2d7a7a]">PKR {{ taxBreakdown.card?.taxCollected?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center p-4 bg-[#2d7a7a] text-white rounded-lg font-bold">
            <div>
              <span>Total GST Collected</span>
            </div>
            <div>
              <span class="text-xl">PKR {{ taxBreakdown.totalGST?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Selling Items -->
      <div class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6 text-[#2c3e50]">Top Selling Items</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="(item, index) in topItems"
            :key="item.menuItem?._id || index"
            class="flex items-center gap-4 p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="w-10 h-10 flex items-center justify-center bg-[#2d7a7a] text-white rounded-full font-bold">
              #{{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="mb-1">{{ item.name }}</h3>
              <p class="text-[#7f8c8d] text-xs italic mb-1">{{ item.category || 'Uncategorized' }}</p>
              <p class="text-[#7f8c8d] text-sm">
                {{ item.quantity }} sold • PKR {{ item.revenue.toFixed(2) }} revenue
              </p>
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

    const fetchReports = async () => {
      loading.value = true
      error.value = ''
      try {
        const params = {}
        if (filters.value.startDate) params.startDate = filters.value.startDate
        if (filters.value.endDate) params.endDate = filters.value.endDate

        // Fetch all reports in parallel
        const [salesRes, paymentRes, itemsRes] = await Promise.all([
          api.get('/reports/daily-sales', { params }),
          api.get('/reports/payment-breakdown', { params }),
          api.get('/reports/top-items', { params: { ...params, limit: 10 } }),
        ])

        salesSummary.value = salesRes.data.data.summary || {}
        paymentBreakdown.value = paymentRes.data.data.breakdown || []
        taxBreakdown.value = salesRes.data.data.taxBreakdown || paymentRes.data.data.taxBreakdown || null
        topItems.value = itemsRes.data.data || []
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
      fetchReports,
    }
  },
}
</script>
