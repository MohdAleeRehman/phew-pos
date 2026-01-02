<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c3e50]">Inventory Management</h1>
      <button 
        @click="showModal = true" 
        class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
      >
        + Add Item
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-4">
      <label class="inline-flex items-center gap-3 cursor-pointer text-sm sm:text-base bg-white px-4 py-2.5 rounded-lg shadow-sm border border-[#e0e0e0] hover:border-[#2d7a7a] transition-colors">
        <input
          type="checkbox"
          v-model="showLowStockOnly"
          @change="fetchInventory"
          class="w-5 h-5 rounded border-2 border-[#2d7a7a] accent-[#2d7a7a]"
        />
        <span class="font-medium">Show Low Stock Only</span>
      </label>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8 text-sm sm:text-base">Loading inventory...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{{ error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="item in inventoryItems"
        :key="item._id"
        :class="['bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm sm:shadow-md border-2', item.isLowStock ? 'border-[#f39c12] bg-[#fff9e6]' : 'border-transparent']"
      >
        <div>
          <h3 class="font-medium text-sm sm:text-base text-[#2c3e50] mb-1">{{ item.name }}</h3>
          <p v-if="item.description" class="text-xs text-[#7f8c8d] mb-3 line-clamp-2">{{ item.description }}</p>
          
          <div class="flex flex-wrap items-center gap-2 my-3">
            <span class="text-[#7f8c8d] text-xs sm:text-sm">Stock:</span>
            <span :class="['font-semibold text-sm sm:text-lg', item.isLowStock ? 'text-[#f39c12]' : 'text-[#27ae60]']">
              {{ item.currentStock }} {{ item.unit }}
            </span>
            <span v-if="item.isLowStock" class="bg-[#f39c12] text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              ⚠️ Low
            </span>
          </div>
          
          <div class="text-[#7f8c8d] text-xs mb-3">
            Threshold: {{ item.lowStockThreshold }} {{ item.unit }}
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <button
            @click="openStockModal(item)"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
          >
            Update
          </button>
          <button
            @click="editItem(item)"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
          >
            Edit
          </button>
          <button
            @click="deleteItem(item._id)"
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click="closeModal">
      <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="text-lg sm:text-xl font-bold mb-4">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Name</label>
            <input v-model="itemForm.name" type="text" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Description</label>
            <textarea v-model="itemForm.description" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Unit</label>
            <input v-model="itemForm.unit" type="text" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block mb-1.5 font-medium text-sm">Current Stock</label>
              <input v-model.number="itemForm.currentStock" type="number" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required min="0" />
            </div>
            <div>
              <label class="block mb-1.5 font-medium text-sm">Low Threshold</label>
              <input v-model.number="itemForm.lowStockThreshold" type="number" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required min="0" />
            </div>
          </div>
          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stock Update Modal -->
    <div v-if="showStockModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click="showStockModal = false">
      <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="text-lg sm:text-xl font-bold mb-4">Update Stock: {{ stockItem?.name }}</h2>
        <form @submit.prevent="updateStock">
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Current Stock</label>
            <input
              v-model.number="stockForm.currentStock"
              type="number"
              class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]"
              required
              min="0"
            />
            <small class="block mt-1 text-[#7f8c8d] text-xs">Unit: {{ stockItem?.unit }}</small>
          </div>
          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="showStockModal = false" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

export default {
  name: 'Inventory',
  setup() {
    const inventoryItems = ref([])
    const loading = ref(false)
    const error = ref('')
    const showModal = ref(false)
    const showStockModal = ref(false)
    const editingItem = ref(null)
    const stockItem = ref(null)
    const showLowStockOnly = ref(false)
    const itemForm = ref({
      name: '',
      description: '',
      unit: 'unit',
      currentStock: 0,
      lowStockThreshold: 10,
    })
    const stockForm = ref({
      currentStock: 0,
    })

    const fetchInventory = async () => {
      loading.value = true
      error.value = ''
      try {
        const params = {}
        if (showLowStockOnly.value) {
          params.lowStock = 'true'
        }
        const response = await api.get('/inventory', { params })
        inventoryItems.value = response.data.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to fetch inventory'
      } finally {
        loading.value = false
      }
    }

    const saveItem = async () => {
      try {
        if (editingItem.value) {
          await api.put(`/inventory/${editingItem.value._id}`, itemForm.value)
        } else {
          await api.post('/inventory', itemForm.value)
        }
        await fetchInventory()
        closeModal()
      } catch (err) {
        alert('Failed to save item: ' + (err.response?.data?.message || err.message))
      }
    }

    const editItem = (item) => {
      editingItem.value = item
      itemForm.value = {
        name: item.name,
        description: item.description || '',
        unit: item.unit,
        currentStock: item.currentStock,
        lowStockThreshold: item.lowStockThreshold,
      }
      showModal.value = true
    }

    const deleteItem = async (id) => {
      if (!confirm('Delete this inventory item?')) return
      try {
        await api.delete(`/inventory/${id}`)
        await fetchInventory()
      } catch (err) {
        alert('Failed to delete item: ' + (err.response?.data?.message || err.message))
      }
    }

    const openStockModal = (item) => {
      stockItem.value = item
      stockForm.value = {
        currentStock: item.currentStock,
      }
      showStockModal.value = true
    }

    const updateStock = async () => {
      try {
        await api.patch(`/inventory/${stockItem.value._id}/stock`, stockForm.value)
        await fetchInventory()
        showStockModal.value = false
        stockItem.value = null
      } catch (err) {
        alert('Failed to update stock: ' + (err.response?.data?.message || err.message))
      }
    }

    const closeModal = () => {
      showModal.value = false
      editingItem.value = null
      itemForm.value = {
        name: '',
        description: '',
        unit: 'unit',
        currentStock: 0,
        lowStockThreshold: 10,
      }
    }

    onMounted(() => {
      fetchInventory()
    })

    return {
      inventoryItems,
      loading,
      error,
      showModal,
      showStockModal,
      editingItem,
      stockItem,
      showLowStockOnly,
      itemForm,
      stockForm,
      fetchInventory,
      saveItem,
      editItem,
      deleteItem,
      openStockModal,
      updateStock,
      closeModal,
    }
  },
}
</script>
