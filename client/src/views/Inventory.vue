<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1>Inventory Management</h1>
      <button 
        @click="showModal = true" 
        class="px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
      >
        + Add Item
      </button>
    </div>

    <div class="mb-6">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="showLowStockOnly"
          @change="fetchInventory"
        />
        <span>Show Low Stock Only</span>
      </label>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">Loading inventory...</div>
    <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg">{{ error }}</div>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
      <div
        v-for="item in inventoryItems"
        :key="item._id"
        :class="['bg-white rounded-xl p-6 shadow-md border-2', item.isLowStock ? 'border-[#f39c12] bg-[#fff9e6]' : 'border-transparent']"
      >
        <div>
          <h3 class="mb-2 text-[#2c3e50]">{{ item.name }}</h3>
          <p v-if="item.description" class="text-sm text-[#7f8c8d] mb-4">{{ item.description }}</p>
          <div class="flex items-center gap-2 my-4">
            <span class="text-[#7f8c8d]">Current Stock:</span>
            <span :class="['font-semibold text-lg', item.isLowStock ? 'text-[#f39c12]' : 'text-[#27ae60]']">
              {{ item.currentStock }} {{ item.unit }}
            </span>
            <span v-if="item.isLowStock" class="bg-[#f39c12] text-white px-3 py-1 rounded-full text-xs font-semibold">
              ⚠️ Low Stock
            </span>
          </div>
          <div class="text-[#7f8c8d] text-sm mb-4">
            <span>Low Stock Threshold: {{ item.lowStockThreshold }} {{ item.unit }}</span>
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            @click="openStockModal(item)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
          >
            Update Stock
          </button>
          <button
            @click="editItem(item)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
          >
            Edit
          </button>
          <button
            @click="deleteItem(item._id)"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="closeModal">
      <div class="bg-white rounded-xl p-8 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="mb-6">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="mb-6">
            <label class="block mb-2 font-medium">Name</label>
            <input v-model="itemForm.name" type="text" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Description</label>
            <textarea v-model="itemForm.description" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"></textarea>
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Unit</label>
            <input v-model="itemForm.unit" type="text" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Current Stock</label>
            <input v-model.number="itemForm.currentStock" type="number" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required min="0" />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Low Stock Threshold</label>
            <input v-model.number="itemForm.lowStockThreshold" type="number" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required min="0" />
          </div>
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" @click="closeModal" class="px-6 py-3 rounded-lg text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 rounded-lg text-base font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stock Update Modal -->
    <div v-if="showStockModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="showStockModal = false">
      <div class="bg-white rounded-xl p-8 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="mb-6">Update Stock: {{ stockItem?.name }}</h2>
        <form @submit.prevent="updateStock">
          <div class="mb-6">
            <label class="block mb-2 font-medium">Current Stock</label>
            <input
              v-model.number="stockForm.currentStock"
              type="number"
              class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
              required
              min="0"
            />
            <small class="block mt-1 text-[#7f8c8d] text-sm">Unit: {{ stockItem?.unit }}</small>
          </div>
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" @click="showStockModal = false" class="px-6 py-3 rounded-lg text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 rounded-lg text-base font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Update</button>
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
