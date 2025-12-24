<template>
  <div class="p-4 md:p-8">
    <div class="mb-8">
      <h1>Settings</h1>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Tax Settings -->
      <div class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6">GST Tax Configuration</h2>
        <form @submit.prevent="saveTaxSettings">
          <div class="mb-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="taxForm.isEnabled"
              />
              <span>Enable GST</span>
            </label>
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Cash Payment GST Rate (%)</label>
            <input
              v-model.number="taxForm.cashRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a] disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="!taxForm.isEnabled"
            />
            <small class="block mt-1 text-[#7f8c8d] text-sm">Enter as percentage (e.g., 18 for 18%)</small>
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Card Payment GST Rate (%)</label>
            <input
              v-model.number="taxForm.cardRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a] disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="!taxForm.isEnabled"
            />
            <small class="block mt-1 text-[#7f8c8d] text-sm">Enter as percentage (e.g., 5 for 5%)</small>
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Tax Name</label>
            <input
              v-model="taxForm.name"
              type="text"
              class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
            />
          </div>
          <button type="submit" class="px-6 py-3 rounded-lg text-base font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all">
            Save Tax Settings
          </button>
        </form>
      </div>

      <!-- User Management (Admin Only) -->
      <div class="bg-white rounded-xl p-8 shadow-md">
        <h2 class="mb-6">User Management</h2>
        <button 
          @click="showUserModal = true" 
          class="mb-4 px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]"
        >
          + Add User
        </button>
        <div v-if="loadingUsers" class="flex justify-center items-center py-8">Loading users...</div>
        <div v-else class="flex flex-col gap-4">
          <div
            v-for="user in users"
            :key="user._id"
            class="flex justify-between items-center p-4 bg-[#f5f5f5] rounded-lg"
          >
            <div>
              <h3 class="mb-1">{{ user.name }}</h3>
              <p class="text-[#7f8c8d] text-sm capitalize">{{ user.username }} • {{ user.role }}</p>
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="user.isActive"
                  @change="toggleUserStatus(user)"
                />
                <span>{{ user.isActive ? 'Active' : 'Inactive' }}</span>
              </label>
              <button
                @click="deleteUser(user._id)"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="showUserModal = false">
      <div class="bg-white rounded-xl p-8 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto" @click.stop>
        <h2 class="mb-6">Add User</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-6">
            <label class="block mb-2 font-medium">Name</label>
            <input v-model="userForm.name" type="text" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Username</label>
            <input v-model="userForm.username" type="text" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Password</label>
            <input v-model="userForm.password" type="password" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required minlength="6" />
          </div>
          <div class="mb-6">
            <label class="block mb-2 font-medium">Role</label>
            <select v-model="userForm.role" class="w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]" required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" @click="showUserModal = false" class="px-6 py-3 rounded-lg text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all">
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
