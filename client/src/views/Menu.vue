<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c3e50]">Menu Management</h1>
      <button 
        @click="showCategoryModal = true" 
        class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
      >
        + Add Category
      </button>
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 lg:gap-6">
      <!-- Categories Panel -->
      <div class="order-1 lg:order-none">
        <h2 class="text-base sm:text-lg font-bold text-[#2c3e50] mb-3">Categories</h2>
        
        <!-- Mobile: Horizontal scroll -->
        <div class="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-3 px-3">
          <div
            v-for="category in categories"
            :key="category._id"
            :class="['flex-shrink-0 bg-white rounded-lg p-3 cursor-pointer transition-all border-2 min-w-[140px]', selectedCategory?._id === category._id ? 'border-[#2d7a7a] bg-[#f0f9f9]' : 'border-[#e0e0e0]']"
            @click="selectCategory(category)"
          >
            <h3 class="text-sm font-medium mb-1 truncate">{{ category.name }}</h3>
            <div class="flex gap-1 mt-2">
              <button
                @click.stop="editCategory(category)"
                class="px-2 py-1 rounded text-xs font-medium bg-[#e0e0e0] text-[#2c3e50]"
              >
                Edit
              </button>
              <button
                @click.stop="deleteCategory(category._id)"
                class="px-2 py-1 rounded text-xs font-medium bg-[#e74c3c] text-white"
              >
                Del
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop: Vertical list -->
        <div class="hidden lg:flex flex-col gap-3">
          <div
            v-for="category in categories"
            :key="category._id"
            :class="['bg-white rounded-lg p-4 cursor-pointer transition-all border-2', selectedCategory?._id === category._id ? 'border-[#2d7a7a] bg-[#f0f9f9]' : 'border-[#e0e0e0] hover:border-[#2d7a7a]']"
            @click="selectCategory(category)"
          >
            <div>
              <h3 class="font-medium mb-1">{{ category.name }}</h3>
              <p v-if="category.description" class="text-xs text-[#7f8c8d] line-clamp-2">{{ category.description }}</p>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                @click.stop="editCategory(category)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
              >
                Edit
              </button>
              <button
                @click.stop="deleteCategory(category._id)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Panel -->
      <div class="order-2 lg:order-none">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <h2 class="text-base sm:text-lg font-bold text-[#2c3e50]">
            {{ selectedCategory ? selectedCategory.name + ' Items' : 'Select a category' }}
          </h2>
          <button
            v-if="selectedCategory"
            @click="showItemModal = true"
            class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
          >
            + Add Item
          </button>
        </div>

        <div v-if="selectedCategory" class="flex flex-col gap-3">
          <div
            v-for="item in categoryItems"
            :key="item._id"
            class="bg-white rounded-lg p-3 sm:p-4 shadow-sm"
          >
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm sm:text-base mb-1">{{ item.name }}</h3>
                <p v-if="item.description" class="text-xs text-[#7f8c8d] mb-2 line-clamp-2">{{ item.description }}</p>
                <p class="text-[#2d7a7a] font-semibold text-base sm:text-lg">PKR {{ item.price.toFixed(0) }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    :checked="item.isAvailable"
                    @change="toggleAvailability(item)"
                    class="w-5 h-5 rounded border-2 border-[#2d7a7a] accent-[#2d7a7a]"
                  />
                  <span :class="item.isAvailable ? 'text-[#27ae60] font-medium' : 'text-[#e74c3c]'">{{ item.isAvailable ? 'Available' : 'Unavailable' }}</span>
                </label>
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
        </div>

        <div v-else class="bg-white rounded-lg p-8 text-center text-[#7f8c8d]">
          <p>Select a category to view and manage items</p>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click="showCategoryModal = false">
      <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="text-lg sm:text-xl font-bold mb-4">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Name</label>
            <input v-model="categoryForm.name" type="text" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Description</label>
            <textarea v-model="categoryForm.description" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Display Order</label>
            <input v-model.number="categoryForm.displayOrder" type="number" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" />
          </div>
          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="closeCategoryModal" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Item Modal -->
    <div v-if="showItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click="showItemModal = false">
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
            <label class="block mb-1.5 font-medium text-sm">Price (PKR)</label>
            <input v-model.number="itemForm.price" type="number" step="0.01" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-4">
            <label class="inline-flex items-center gap-3 cursor-pointer text-sm bg-[#f5f5f5] px-4 py-2.5 rounded-lg hover:bg-[#e8e8e8] transition-colors">
              <input v-model="itemForm.isAvailable" type="checkbox" class="w-5 h-5 rounded border-2 border-[#2d7a7a] accent-[#2d7a7a]" />
              <span class="font-medium">Available</span>
            </label>
          </div>
          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="closeItemModal" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'

export default {
  name: 'Menu',
  setup() {
    const categories = ref([])
    const menuItems = ref([])
    const selectedCategory = ref(null)
    const showCategoryModal = ref(false)
    const showItemModal = ref(false)
    const editingCategory = ref(null)
    const editingItem = ref(null)
    const categoryForm = ref({
      name: '',
      description: '',
      displayOrder: 0,
    })
    const itemForm = ref({
      name: '',
      description: '',
      price: 0,
      isAvailable: true,
    })

    const categoryItems = computed(() => {
      if (!selectedCategory.value) return []
      return menuItems.value.filter(
        (item) => item.category && item.category._id === selectedCategory.value._id
      )
    })

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        categories.value = response.data.data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menu-items')
        menuItems.value = response.data.data
      } catch (error) {
        console.error('Failed to fetch menu items:', error)
      }
    }

    const selectCategory = (category) => {
      selectedCategory.value = category
    }

    const saveCategory = async () => {
      try {
        if (editingCategory.value) {
          await api.put(`/categories/${editingCategory.value._id}`, categoryForm.value)
        } else {
          await api.post('/categories', categoryForm.value)
        }
        await fetchCategories()
        closeCategoryModal()
      } catch (error) {
        alert('Failed to save category: ' + (error.response?.data?.message || error.message))
      }
    }

    const editCategory = (category) => {
      editingCategory.value = category
      categoryForm.value = {
        name: category.name,
        description: category.description || '',
        displayOrder: category.displayOrder || 0,
      }
      showCategoryModal.value = true
    }

    const deleteCategory = async (id) => {
      if (!confirm('Delete this category?')) return
      try {
        await api.delete(`/categories/${id}`)
        await fetchCategories()
        if (selectedCategory.value?._id === id) {
          selectedCategory.value = null
        }
      } catch (error) {
        alert('Failed to delete category: ' + (error.response?.data?.message || error.message))
      }
    }

    const closeCategoryModal = () => {
      showCategoryModal.value = false
      editingCategory.value = null
      categoryForm.value = {
        name: '',
        description: '',
        displayOrder: 0,
      }
    }

    const saveItem = async () => {
      try {
        const data = {
          ...itemForm.value,
          category: selectedCategory.value._id,
        }
        if (editingItem.value) {
          await api.put(`/menu-items/${editingItem.value._id}`, data)
        } else {
          await api.post('/menu-items', data)
        }
        await fetchMenuItems()
        closeItemModal()
      } catch (error) {
        alert('Failed to save item: ' + (error.response?.data?.message || error.message))
      }
    }

    const editItem = (item) => {
      editingItem.value = item
      itemForm.value = {
        name: item.name,
        description: item.description || '',
        price: item.price,
        isAvailable: item.isAvailable,
      }
      showItemModal.value = true
    }

    const deleteItem = async (id) => {
      if (!confirm('Delete this item?')) return
      try {
        await api.delete(`/menu-items/${id}`)
        await fetchMenuItems()
      } catch (error) {
        alert('Failed to delete item: ' + (error.response?.data?.message || error.message))
      }
    }

    const toggleAvailability = async (item) => {
      try {
        await api.patch(`/menu-items/${item._id}/availability`)
        await fetchMenuItems()
      } catch (error) {
        alert('Failed to toggle availability: ' + (error.response?.data?.message || error.message))
      }
    }

    const closeItemModal = () => {
      showItemModal.value = false
      editingItem.value = null
      itemForm.value = {
        name: '',
        description: '',
        price: 0,
        isAvailable: true,
      }
    }

    onMounted(() => {
      fetchCategories()
      fetchMenuItems()
    })

    return {
      categories,
      menuItems,
      selectedCategory,
      categoryItems,
      showCategoryModal,
      showItemModal,
      editingCategory,
      editingItem,
      categoryForm,
      itemForm,
      selectCategory,
      saveCategory,
      editCategory,
      deleteCategory,
      closeCategoryModal,
      saveItem,
      editItem,
      deleteItem,
      toggleAvailability,
      closeItemModal,
    }
  },
}
</script>
