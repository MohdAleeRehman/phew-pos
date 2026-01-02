<template>
  <div class="p-3 sm:p-4 lg:p-6 min-h-screen flex flex-col">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <h1 class="text-xl sm:text-2xl lg:text-3xl text-[#2c3e50] font-bold">Point of Sale</h1>
      <div class="flex gap-2">
        <button
          :class="['px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium inline-flex items-center justify-center gap-1 sm:gap-2 transition-all', orderType === 'dine-in' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
          @click="setOrderType('dine-in')"
        >
          Dine In
        </button>
        <button
          :class="['px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium inline-flex items-center justify-center gap-1 sm:gap-2 transition-all', orderType === 'takeaway' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
          @click="setOrderType('takeaway')"
        >
          Takeaway
        </button>
      </div>
    </div>

    <!-- Mobile Cart Toggle Button -->
    <button 
      @click="showMobileCart = !showMobileCart"
      class="lg:hidden fixed bottom-4 right-4 z-30 w-14 h-14 bg-[#2d7a7a] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1a5a5a] transition-all"
    >
      <span class="text-xl">🛒</span>
      <span v-if="cart.length > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-[#ff6b35] rounded-full text-xs flex items-center justify-center font-bold">
        {{ cart.reduce((sum, item) => sum + item.quantity, 0) }}
      </span>
    </button>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 overflow-hidden">
      <!-- Menu Section -->
      <div class="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden">
        <!-- Categories - Horizontal scroll on mobile, Vertical sidebar on desktop -->
        <div class="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-thin shrink-0">
          <button
            v-for="category in categories"
            :key="category._id"
            :class="['px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg cursor-pointer transition-all font-medium whitespace-nowrap text-xs sm:text-sm shrink-0', selectedCategory === category._id ? 'bg-[#2d7a7a] text-white border-[#2d7a7a]' : 'bg-white border-[#e0e0e0] hover:border-[#2d7a7a] hover:bg-[#f5f5f5]']"
            @click="selectedCategory = category._id"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Categories Sidebar - Desktop Only -->
        <div class="hidden lg:flex flex-col w-44 xl:w-52 shrink-0 bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-3 bg-[#2d7a7a] text-white font-semibold text-sm">Categories</div>
          <div class="flex-1 overflow-y-auto">
            <button
              v-for="category in categories"
              :key="category._id"
              :class="['w-full px-4 py-3 text-left text-sm font-medium transition-all border-l-4', selectedCategory === category._id ? 'bg-[#f0f9f9] text-[#2d7a7a] border-[#2d7a7a]' : 'bg-white text-[#2c3e50] border-transparent hover:bg-[#f5f5f5] hover:border-[#e0e0e0]']"
              @click="selectedCategory = category._id"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Menu Items Grid -->
        <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 overflow-y-auto p-1 content-start auto-rows-max">
          <div
            v-for="item in filteredMenuItems"
            :key="item._id"
            class="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all shadow-sm sm:shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-2 hover:border-[#2d7a7a] h-24 sm:h-28 lg:h-32 flex flex-col justify-between"
            @click="addToCart(item)"
          >
            <div>
              <h3 class="text-[#2c3e50] font-medium line-clamp-2 text-xs sm:text-sm lg:text-base leading-tight">{{ item.name }}</h3>
            </div>
            <p class="text-[#2d7a7a] font-semibold text-sm sm:text-base lg:text-lg mt-auto">PKR {{ item.price.toFixed(0) }}</p>
          </div>
        </div>
      </div>

      <!-- Cart Section - Desktop -->
      <div class="hidden lg:flex w-80 xl:w-96 bg-white rounded-xl p-4 xl:p-6 flex-col shadow-md h-full max-h-full overflow-hidden">
        <!-- Cart Header -->
        <div class="flex justify-between items-center mb-4 pb-4 border-b-2 border-[#e0e0e0] shrink-0">
          <h2 class="text-xl xl:text-2xl font-bold text-[#2c3e50]">Cart</h2>
          <button 
            v-if="cart.length > 0" 
            @click="clearCart" 
            class="px-3 py-2 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
          >
            Clear
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto mb-4 min-h-0 scrollbar-thin">
          <div v-if="cart.length === 0" class="text-center py-8 text-[#7f8c8d] text-base">
            <p>Cart is empty</p>
          </div>
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="flex justify-between items-start gap-2 p-3 border-b border-[#e0e0e0]"
          >
            <div class="flex-1 min-w-0">
              <h4 class="mb-1 text-sm xl:text-base font-semibold text-[#2c3e50] truncate">{{ item.name }}</h4>
              <p class="text-[#7f8c8d] text-xs xl:text-sm font-medium">PKR {{ item.price.toFixed(0) }} × {{ item.quantity }}</p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                @click="updateQuantity(index, item.quantity - 1)"
                class="w-7 h-7 xl:w-8 xl:h-8 rounded-lg text-sm font-bold bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all flex items-center justify-center"
              >
                -
              </button>
              <span class="min-w-6 xl:min-w-8 text-center font-bold text-sm xl:text-base">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(index, item.quantity + 1)"
                class="w-7 h-7 xl:w-8 xl:h-8 rounded-lg text-sm font-bold bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all flex items-center justify-center"
              >
                +
              </button>
              <button
                @click="removeFromCart(index)"
                class="w-7 h-7 xl:w-8 xl:h-8 rounded-lg text-base font-bold bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all flex items-center justify-center ml-1"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="shrink-0 flex flex-col overflow-y-auto min-h-0 max-h-[45vh]">
          <div class="py-3 border-t-2 border-[#e0e0e0]">
            <div class="flex justify-between py-1 text-sm xl:text-base">
              <span class="font-medium">Subtotal:</span>
              <span class="font-semibold">PKR {{ cartTotal.toFixed(0) }}</span>
            </div>
            <div class="flex flex-col gap-2 my-2">
              <select v-model="discountType" class="w-full px-2 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]">
                <option value="none">No Discount</option>
                <option value="flat">Flat Discount</option>
                <option value="percentage">Percentage Discount</option>
              </select>
              <input
                v-if="discountType !== 'none'"
                v-model.number="discountValue"
                type="number"
                class="w-full px-2 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]"
                :placeholder="discountType === 'flat' ? 'Amount' : 'Percentage'"
                min="0"
              />
            </div>
            <div v-if="discountAmount > 0" class="flex justify-between py-1 text-sm xl:text-base">
              <span class="font-medium">Discount:</span>
              <span class="font-semibold text-[#e74c3c]">-PKR {{ discountAmount.toFixed(0) }}</span>
            </div>
            <div v-if="taxConfig.isEnabled" class="flex justify-between py-1 text-sm xl:text-base">
              <span class="font-medium">GST ({{ (taxRate * 100).toFixed(0) }}%):</span>
              <span class="font-semibold">PKR {{ taxAmount.toFixed(0) }}</span>
            </div>
            <div class="flex justify-between py-2 text-lg xl:text-xl font-bold text-[#2d7a7a] border-t-2 border-[#e0e0e0] mt-2 pt-2">
              <span>Total:</span>
              <span>PKR {{ grandTotal.toFixed(0) }}</span>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t-2 border-[#e0e0e0]">
            <h3 class="mb-3 text-base xl:text-lg font-bold text-[#2c3e50]">Payment</h3>
            <div class="flex gap-2 mb-3">
              <button
                :class="['flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all', paymentMethod === 'cash' ? 'bg-[#2d7a7a] text-white' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
                @click="paymentMethod = 'cash'"
              >
                Cash
              </button>
              <button
                :class="['flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all', paymentMethod === 'card' ? 'bg-[#2d7a7a] text-white' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
                @click="paymentMethod = 'card'"
              >
                Card
              </button>
            </div>
            <div v-if="paymentMethod === 'cash'" class="mb-3">
              <input
                v-model.number="cashReceived"
                type="number"
                step="0.01"
                min="0"
                :placeholder="`Cash (Total: PKR ${grandTotal.toFixed(0)})`"
                class="w-full px-3 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm transition-colors focus:outline-none focus:border-[#2d7a7a]"
              />
              <div v-if="cashReceived > 0 && cashReceived < grandTotal" class="mt-1 text-xs text-[#e74c3c] font-medium">
                Need PKR {{ (grandTotal - cashReceived).toFixed(0) }} more
              </div>
              <div v-if="cashReceived > 0 && change > 0" class="mt-1 text-sm text-[#27ae60] font-bold">
                Change: PKR {{ change.toFixed(0) }}
              </div>
            </div>
            <button
              @click="processOrder"
              :disabled="cart.length === 0 || processing || (paymentMethod === 'cash' && cashReceived < grandTotal)"
              class="w-full px-4 py-3 bg-[#27ae60] text-white rounded-lg text-base font-bold hover:bg-[#229954] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ processing ? 'Processing...' : 'Complete Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Cart Modal -->
    <div 
      v-if="showMobileCart" 
      class="lg:hidden fixed inset-0 bg-black/50 z-40"
      @click="showMobileCart = false"
    ></div>
    <div 
      :class="[
        'lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col',
        showMobileCart ? 'translate-y-0' : 'translate-y-full'
      ]"
    >
      <!-- Mobile Cart Handle -->
      <div class="flex justify-center py-2 border-b border-[#e0e0e0]">
        <div class="w-12 h-1.5 bg-[#e0e0e0] rounded-full"></div>
      </div>

      <!-- Mobile Cart Header -->
      <div class="flex justify-between items-center px-4 py-3 border-b border-[#e0e0e0]">
        <h2 class="text-lg font-bold text-[#2c3e50]">Cart ({{ cart.reduce((sum, item) => sum + item.quantity, 0) }} items)</h2>
        <div class="flex gap-2">
          <button 
            v-if="cart.length > 0" 
            @click="clearCart" 
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e0e0e0] text-[#2c3e50]"
          >
            Clear
          </button>
          <button 
            @click="showMobileCart = false" 
            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e74c3c] text-white"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Mobile Cart Items -->
      <div class="flex-1 overflow-y-auto px-4 py-2 min-h-0">
        <div v-if="cart.length === 0" class="text-center py-8 text-[#7f8c8d]">
          <p>Cart is empty</p>
        </div>
        <div
          v-for="(item, index) in cart"
          :key="index"
          class="flex justify-between items-center gap-2 py-3 border-b border-[#e0e0e0]"
        >
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-[#2c3e50] truncate">{{ item.name }}</h4>
            <p class="text-[#7f8c8d] text-xs">PKR {{ item.price.toFixed(0) }} × {{ item.quantity }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="updateQuantity(index, item.quantity - 1)"
              class="w-7 h-7 rounded-lg text-sm font-bold bg-[#e0e0e0] text-[#2c3e50] flex items-center justify-center"
            >
              -
            </button>
            <span class="min-w-6 text-center font-bold text-sm">{{ item.quantity }}</span>
            <button
              @click="updateQuantity(index, item.quantity + 1)"
              class="w-7 h-7 rounded-lg text-sm font-bold bg-[#e0e0e0] text-[#2c3e50] flex items-center justify-center"
            >
              +
            </button>
            <button
              @click="removeFromCart(index)"
              class="w-7 h-7 rounded-lg text-base font-bold bg-[#e74c3c] text-white flex items-center justify-center ml-1"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Cart Summary -->
      <div class="px-4 py-3 border-t-2 border-[#e0e0e0] bg-white">
        <div class="flex justify-between py-1 text-sm">
          <span>Subtotal:</span>
          <span class="font-semibold">PKR {{ cartTotal.toFixed(0) }}</span>
        </div>
        <div class="flex gap-2 my-2">
          <select v-model="discountType" class="flex-1 px-2 py-2 border-2 border-[#e0e0e0] rounded-lg text-xs">
            <option value="none">No Discount</option>
            <option value="flat">Flat</option>
            <option value="percentage">%</option>
          </select>
          <input
            v-if="discountType !== 'none'"
            v-model.number="discountValue"
            type="number"
            class="w-20 px-2 py-2 border-2 border-[#e0e0e0] rounded-lg text-xs"
            :placeholder="discountType === 'flat' ? 'Amt' : '%'"
            min="0"
          />
        </div>
        <div v-if="discountAmount > 0" class="flex justify-between py-1 text-sm">
          <span>Discount:</span>
          <span class="text-[#e74c3c]">-PKR {{ discountAmount.toFixed(0) }}</span>
        </div>
        <div v-if="taxConfig.isEnabled" class="flex justify-between py-1 text-sm">
          <span>GST ({{ (taxRate * 100).toFixed(0) }}%):</span>
          <span>PKR {{ taxAmount.toFixed(0) }}</span>
        </div>
        <div class="flex justify-between py-2 text-lg font-bold text-[#2d7a7a] border-t border-[#e0e0e0] mt-1 pt-2">
          <span>Total:</span>
          <span>PKR {{ grandTotal.toFixed(0) }}</span>
        </div>

        <!-- Payment -->
        <div class="flex gap-2 my-2">
          <button
            :class="['flex-1 px-3 py-2 rounded-lg text-xs font-medium', paymentMethod === 'cash' ? 'bg-[#2d7a7a] text-white' : 'bg-[#e0e0e0] text-[#2c3e50]']"
            @click="paymentMethod = 'cash'"
          >
            Cash
          </button>
          <button
            :class="['flex-1 px-3 py-2 rounded-lg text-xs font-medium', paymentMethod === 'card' ? 'bg-[#2d7a7a] text-white' : 'bg-[#e0e0e0] text-[#2c3e50]']"
            @click="paymentMethod = 'card'"
          >
            Card
          </button>
        </div>
        <div v-if="paymentMethod === 'cash'" class="mb-2">
          <input
            v-model.number="cashReceived"
            type="number"
            :placeholder="`Cash received (PKR ${grandTotal.toFixed(0)})`"
            class="w-full px-3 py-2 border-2 border-[#e0e0e0] rounded-lg text-sm"
          />
          <div v-if="cashReceived > 0 && change > 0" class="mt-1 text-sm text-[#27ae60] font-bold">
            Change: PKR {{ change.toFixed(0) }}
          </div>
        </div>
        <button
          @click="processOrder"
          :disabled="cart.length === 0 || processing || (paymentMethod === 'cash' && cashReceived < grandTotal)"
          class="w-full py-3 bg-[#27ae60] text-white rounded-lg text-base font-bold disabled:opacity-60"
        >
          {{ processing ? 'Processing...' : 'Complete Order' }}
        </button>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceipt && completedOrder" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeReceipt">
      <div class="bg-white rounded-xl p-6 max-w-md w-[90%] max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Order Receipt</h2>
          <div class="flex gap-2">
            <button
              @click="printReceipt"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d7a7a] text-white hover:bg-[#1a5a5a] transition-all"
            >
              Print
            </button>
            <button
              @click="closeReceipt"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
            >
              Close
            </button>
          </div>
        </div>
        <Receipt :order="completedOrder" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { usePOSStore } from '../stores/pos'
import Receipt from '../components/Receipt.vue'

export default {
  name: 'POS',
  setup() {
    const posStore = usePOSStore()
    const processing = ref(false)
    const showMobileCart = ref(false)

    const categories = computed(() => posStore.categories)
    const selectedCategory = computed({
      get: () => posStore.selectedCategory,
      set: (value) => {
        posStore.selectedCategory = value
      },
    })
    const filteredMenuItems = computed(() => posStore.filteredMenuItems)
    const cart = computed(() => posStore.cart)
    const orderType = computed(() => posStore.orderType)
    const discountType = computed({
      get: () => posStore.discountType,
      set: (value) => posStore.setDiscountType(value),
    })
    const discountValue = computed({
      get: () => posStore.discountValue,
      set: (value) => {
        posStore.discountValue = value
      },
    })
    const paymentMethod = computed({
      get: () => posStore.paymentMethod,
      set: (value) => posStore.setPaymentMethod(value),
    })
    const cashReceived = computed({
      get: () => posStore.cashReceived,
      set: (value) => {
        posStore.cashReceived = value
      },
    })
    const cartTotal = computed(() => posStore.cartTotal)
    const discountAmount = computed(() => posStore.discountAmount)
    const taxConfig = computed(() => posStore.taxConfig)
    const taxRate = computed(() => posStore.taxRate)
    const taxAmount = computed(() => posStore.taxAmount)
    const grandTotal = computed(() => posStore.grandTotal)
    const change = computed(() => posStore.change)

    onMounted(async () => {
      await posStore.fetchCategories()
      await posStore.fetchMenuItems()
      await posStore.fetchTaxConfig()
    })

    const addToCart = (item) => {
      posStore.addToCart(item)
    }

    const removeFromCart = (index) => {
      posStore.removeFromCart(index)
    }

    const updateQuantity = (index, quantity) => {
      posStore.updateCartItemQuantity(index, quantity)
    }

    const clearCart = () => {
      if (confirm('Clear cart?')) {
        posStore.clearCart()
      }
    }

    const setOrderType = (type) => {
      posStore.setOrderType(type)
    }

    const showReceipt = ref(false)
    const completedOrder = ref(null)

    const processOrder = async () => {
      if (cart.value.length === 0) return

      processing.value = true
      try {
        const result = await posStore.createOrder()
        completedOrder.value = result.data
        showReceipt.value = true
        // Ensure cart is cleared immediately after successful order
        // The store's createOrder already clears it, but this ensures UI updates
      } catch (error) {
        alert('Failed to process order: ' + error.message)
      } finally {
        processing.value = false
      }
    }

    const printReceipt = () => {
      window.print()
    }

    const closeReceipt = () => {
      showReceipt.value = false
      completedOrder.value = null
    }

    return {
      categories,
      selectedCategory,
      filteredMenuItems,
      cart,
      orderType,
      discountType,
      discountValue,
      paymentMethod,
      cartTotal,
      discountAmount,
      taxConfig,
      taxRate,
      taxAmount,
      grandTotal,
      cashReceived,
      change,
      processing,
      showMobileCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setOrderType,
      processOrder,
      showReceipt,
      completedOrder,
      printReceipt,
      closeReceipt,
    }
  },
  components: {
    Receipt,
  },
}
</script>
