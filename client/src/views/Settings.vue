<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2c3e50]">Settings</h1>
    </div>

    <div class="flex flex-col gap-4 sm:gap-6">
      <!-- Tax Settings -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50] mb-4">GST Tax Configuration</h2>
        <form @submit.prevent="saveTaxSettings">
          <div class="mb-4">
            <label class="inline-flex items-center gap-3 cursor-pointer text-sm sm:text-base bg-[#f5f5f5] px-4 py-2.5 rounded-lg hover:bg-[#e8e8e8] transition-colors">
              <input
                type="checkbox"
                v-model="taxForm.isEnabled"
                class="w-5 h-5 rounded border-2 border-[#2d7a7a] accent-[#2d7a7a]"
              />
              <span class="font-medium">Enable GST</span>
            </label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block mb-1.5 font-medium text-sm">Cash GST Rate (%)</label>
              <input
                v-model.number="taxForm.cashRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a] disabled:opacity-60"
                :disabled="!taxForm.isEnabled"
              />
              <small class="block mt-1 text-[#7f8c8d] text-xs">e.g., 18 for 18%</small>
            </div>
            <div>
              <label class="block mb-1.5 font-medium text-sm">Card GST Rate (%)</label>
              <input
                v-model.number="taxForm.cardRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a] disabled:opacity-60"
                :disabled="!taxForm.isEnabled"
              />
              <small class="block mt-1 text-[#7f8c8d] text-xs">e.g., 5 for 5%</small>
            </div>
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Tax Name</label>
            <input
              v-model="taxForm.name"
              type="text"
              class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]"
            />
          </div>
          <button type="submit" class="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">
            Save Tax Settings
          </button>
        </form>
      </div>

      <!-- User Management -->
      <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm sm:shadow-md">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 class="text-base sm:text-lg lg:text-xl font-bold text-[#2c3e50]">User Management</h2>
          <button 
            @click="showUserModal = true" 
            class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
          >
            + Add User
          </button>
        </div>
        
        <div v-if="loadingUsers" class="flex justify-center items-center py-8 text-sm">Loading users...</div>
        <div v-else class="flex flex-col gap-3">
          <div
            v-for="user in users"
            :key="user._id"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm sm:text-base truncate">{{ user.name }}</h3>
              <p class="text-[#7f8c8d] text-xs sm:text-sm capitalize">{{ user.username }} • {{ user.role }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm px-3 py-1.5 rounded-lg" :class="user.isActive ? 'bg-[#e8f5e9]' : 'bg-[#ffebee]'">
                <input
                  type="checkbox"
                  :checked="user.isActive"
                  @change="toggleUserStatus(user)"
                  class="w-5 h-5 rounded border-2 border-[#2d7a7a] accent-[#2d7a7a]"
                />
                <span :class="user.isActive ? 'text-[#27ae60] font-medium' : 'text-[#e74c3c] font-medium'">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
              </label>
              <button
                @click="deleteUser(user._id)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click="showUserModal = false">
      <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="text-lg sm:text-xl font-bold mb-4">Add User</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Name</label>
            <input v-model="userForm.name" type="text" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Username</label>
            <input v-model="userForm.username" type="text" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Password</label>
            <input v-model="userForm.password" type="password" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required minlength="6" />
          </div>
          <div class="mb-4">
            <label class="block mb-1.5 font-medium text-sm">Role</label>
            <select v-model="userForm.role" class="w-full px-3 py-2.5 border-2 border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#2d7a7a]" required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="showUserModal = false" class="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
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
import { ref, onMounted } from 'vue'
import api from '../api/axios'

export default {
  name: 'Settings',
  setup() {
    const taxForm = ref({
      cashRate: 18, // Percentage (18% = 0.18 decimal)
      cardRate: 5, // Percentage (5% = 0.05 decimal)
      isEnabled: true,
      name: 'GST',
    })
    const users = ref([])
    const loadingUsers = ref(false)
    const showUserModal = ref(false)
    const userForm = ref({
      name: '',
      username: '',
      password: '',
      role: 'staff',
    })

    const fetchTaxSettings = async () => {
      try {
        const response = await api.get('/taxes')
        const tax = response.data.data
        taxForm.value = {
          cashRate: (tax.rates?.cash || 0.18) * 100, // Convert decimal to percentage for display
          cardRate: (tax.rates?.card || 0.05) * 100, // Convert decimal to percentage for display
          isEnabled: tax.isEnabled,
          name: tax.name || 'GST',
        }
      } catch (error) {
        console.error('Failed to fetch tax settings:', error)
      }
    }

    const saveTaxSettings = async () => {
      try {
        const data = {
          rates: {
            cash: taxForm.value.cashRate / 100, // Convert percentage to decimal
            card: taxForm.value.cardRate / 100, // Convert percentage to decimal
          },
          isEnabled: taxForm.value.isEnabled,
          name: taxForm.value.name,
        }
        await api.put('/taxes', data)
        alert('Tax settings saved successfully!')
        await fetchTaxSettings()
      } catch (error) {
        alert('Failed to save tax settings: ' + (error.response?.data?.message || error.message))
      }
    }

    const fetchUsers = async () => {
      loadingUsers.value = true
      try {
        const response = await api.get('/users')
        users.value = response.data.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        loadingUsers.value = false
      }
    }

    const saveUser = async () => {
      try {
        await api.post('/auth/register', userForm.value)
        alert('User created successfully!')
        showUserModal.value = false
        userForm.value = {
          name: '',
          username: '',
          password: '',
          role: 'staff',
        }
        await fetchUsers()
      } catch (error) {
        alert('Failed to create user: ' + (error.response?.data?.message || error.message))
      }
    }

    const toggleUserStatus = async (user) => {
      try {
        await api.put(`/users/${user._id}`, {
          isActive: !user.isActive,
        })
        await fetchUsers()
      } catch (error) {
        alert('Failed to update user: ' + (error.response?.data?.message || error.message))
      }
    }

    const deleteUser = async (id) => {
      if (!confirm('Delete this user?')) return
      try {
        await api.delete(`/users/${id}`)
        await fetchUsers()
      } catch (error) {
        alert('Failed to delete user: ' + (error.response?.data?.message || error.message))
      }
    }

    onMounted(() => {
      fetchTaxSettings()
      fetchUsers()
    })

    return {
      taxForm,
      users,
      loadingUsers,
      showUserModal,
      userForm,
      saveTaxSettings,
      saveUser,
      toggleUserStatus,
      deleteUser,
    }
  },
}
</script>
