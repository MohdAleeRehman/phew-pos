<template>
  <div class="p-4 md:p-8">
    <div class="flex justify-between items-center mb-8">
      <h1>Menu Management</h1>
      <button 
        @click="showCategoryModal = true" 
        class="px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
      >
        + Add Category
      </button>
    </div>

    <div class="grid grid-cols-[1fr_2fr] gap-8">
      <div>
        <h2 class="mb-4">Categories</h2>
        <div class="flex flex-col gap-4">
          <div
            v-for="category in categories"
            :key="category._id"
            :class="['bg-white rounded-lg p-4 cursor-pointer transition-all border-2', selectedCategory?._id === category._id ? 'border-[#2d7a7a] bg-[#f5f5f5]' : 'border-[#e0e0e0] hover:border-[#2d7a7a]']"
            @click="selectCategory(category)"
          >
            <div>
              <h3 class="mb-2">{{ category.name }}</h3>
              <p v-if="category.description" class="text-sm text-[#7f8c8d]">{{ category.description }}</p>
            </div>
            <div class="flex gap-2 mt-2">
              <button
                @click.stop="editCategory(category)"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
              >
                Edit
              </button>
              <button
                @click.stop="deleteCategory(category._id)"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-4">
          <h2>
            {{ selectedCategory ? selectedCategory.name + ' Items' : 'Select a category' }}
          </h2>
          <button
            v-if="selectedCategory"
            @click="showItemModal = true"
            class="px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
          >
            + Add Item
          </button>
        </div>
        <div v-if="selectedCategory" class="flex flex-col gap-4">
          <div
            v-for="item in categoryItems"
            :key="item._id"
            class="bg-white rounded-lg p-6 flex justify-between items-center shadow-md"
          >
            <div>
              <h3 class="mb-2">{{ item.name }}</h3>
              <p v-if="item.description" class="text-sm text-[#7f8c8d] mb-2">{{ item.description }}</p>
              <p class="text-[#2d7a7a] font-semibold text-lg">PKR {{ item.price.toFixed(2) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="item.isAvailable"
                  @change="toggleAvailability(item)"
                />
                <span>{{ item.isAvailable ? 'Available' : 'Unavailable' }}</span>
              </label>
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
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="showCategoryModal = false">
      <div class="bg-white rounded-xl p-8 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="mb-6">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="mb-6">
            <label class="block mb-2 font-medium">Name</label>
            <input v-model="categoryForm.name" type="text" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Description</label>
            <textarea v-model="categoryForm.description" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"></textarea>
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Display Order</label>
            <input v-model.number="categoryForm.displayOrder" type="number" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" />
          </div>
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" @click="closeCategoryModal" class="px-6 py-3 rounded-lg text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 rounded-lg text-base font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Item Modal -->
    <div v-if="showItemModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="showItemModal = false">
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
            <label class="block mb-2 font-medium">Price</label>
            <input v-model.number="itemForm.price" type="number" step="0.01" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="itemForm.isAvailable" type="checkbox" />
              <span>Available</span>
            </label>
          </div>
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" @click="closeItemModal" class="px-6 py-3 rounded-lg text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
              Cancel
            </button>
            <button type="submit" class="px-6 py-3 rounded-lg text-base font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">Save</button>
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
        (item) => item.category._id === selectedCategory.value._id
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
