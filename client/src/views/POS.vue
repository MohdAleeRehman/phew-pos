<template>
  <div class="p-4 md:p-8 h-screen flex flex-col">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-8">
      <h1 class="text-2xl md:text-3xl text-[#2c3e50] font-bold">Point of Sale</h1>
      <div class="flex gap-2 md:gap-4">
        <button
          :class="['px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 transition-all', orderType === 'dine-in' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
          @click="setOrderType('dine-in')"
        >
          Dine In
        </button>
        <button
          :class="['px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 transition-all', orderType === 'takeaway' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
          @click="setOrderType('takeaway')"
        >
          Takeaway
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 md:gap-8 flex-1 overflow-hidden">
      <div class="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        <div class="w-full md:w-48 lg:w-56 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
          <button
            v-for="category in categories"
            :key="category._id"
            :class="['px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-left font-medium whitespace-nowrap text-sm md:text-base', selectedCategory === category._id ? 'bg-[#2d7a7a] text-white border-[#2d7a7a]' : 'bg-white border-[#e0e0e0] hover:border-[#2d7a7a] hover:bg-[#f5f5f5]']"
            @click="selectedCategory = category._id"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] auto-rows-max gap-3 md:gap-x-4 md:gap-y-4 overflow-y-auto p-2">
          <div
            v-for="item in filteredMenuItems"
            :key="item._id"
            class="bg-white rounded-xl p-4 md:p-6 cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-2 hover:border-[#2d7a7a] h-[140px] md:h-[160px] flex flex-col justify-between"
            @click="addToCart(item)"
          >
            <div>
              <h3 class="mb-2 text-[#2c3e50] font-medium line-clamp-2 text-sm md:text-base">{{ item.name }}</h3>
            </div>
            <p class="text-[#2d7a7a] font-semibold text-base md:text-lg mt-auto">PKR {{ item.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-[420px] xl:w-[480px] bg-white rounded-xl p-4 md:p-6 flex flex-col shadow-md">
        <div class="flex justify-between items-center mb-4 pb-4 border-b-2 border-[#e0e0e0]">
          <h2 class="text-xl md:text-2xl font-bold text-[#2c3e50]">Cart</h2>
          <button 
            v-if="cart.length > 0" 
            @click="clearCart" 
            class="px-4 py-2 rounded-lg text-sm md:text-base font-medium bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all"
          >
            Clear
          </button>
        </div>

        <div class="flex-1 overflow-y-auto mb-4">
          <div v-if="cart.length === 0" class="text-center py-8 text-[#7f8c8d] text-base md:text-lg">
            <p>Cart is empty</p>
          </div>
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="flex justify-between items-start gap-3 p-3 md:p-4 border-b border-[#e0e0e0]"
          >
            <div class="flex-1 min-w-0">
              <h4 class="mb-1 text-base md:text-lg font-semibold text-[#2c3e50]">{{ item.name }}</h4>
              <p v-if="item.category" class="text-[#7f8c8d] text-xs md:text-sm mb-1 italic">{{ item.category }}</p>
              <p class="text-[#7f8c8d] text-sm md:text-base font-medium">PKR {{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="updateQuantity(index, item.quantity - 1)"
                class="w-8 h-8 md:w-10 md:h-10 rounded-lg text-base md:text-lg font-bold bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all flex items-center justify-center"
              >
                -
              </button>
              <span class="min-w-[32px] md:min-w-[40px] text-center font-bold text-base md:text-lg">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(index, item.quantity + 1)"
                class="w-8 h-8 md:w-10 md:h-10 rounded-lg text-base md:text-lg font-bold bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0] transition-all flex items-center justify-center"
              >
                +
              </button>
              <button
                @click="removeFromCart(index)"
                class="w-8 h-8 md:w-10 md:h-10 rounded-lg text-lg md:text-xl font-bold bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div class="py-4 border-t-2 border-[#e0e0e0]">
          <div class="flex justify-between py-2 text-base md:text-lg">
            <span class="font-medium">Subtotal:</span>
            <span class="font-semibold">PKR {{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 my-2">
            <select v-model="discountType" class="flex-1 px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm md:text-base transition-colors focus:outline-none focus:border-[#2d7a7a]">
              <option value="none">No Discount</option>
              <option value="flat">Flat Discount</option>
              <option value="percentage">Percentage Discount</option>
            </select>
            <input
              v-if="discountType !== 'none'"
              v-model.number="discountValue"
              type="number"
              class="flex-1 px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-sm md:text-base transition-colors focus:outline-none focus:border-[#2d7a7a]"
              :placeholder="discountType === 'flat' ? 'Amount' : 'Percentage'"
              min="0"
            />
          </div>
          <div v-if="discountAmount > 0" class="flex justify-between py-2 text-base md:text-lg">
            <span class="font-medium">Discount:</span>
            <span class="font-semibold text-[#e74c3c]">-PKR {{ discountAmount.toFixed(2) }}</span>
          </div>
          <div v-if="taxConfig.isEnabled" class="flex justify-between py-2 text-base md:text-lg">
            <span class="font-medium">GST ({{ (taxRate * 100).toFixed(0) }}%):</span>
            <span class="font-semibold">PKR {{ taxAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between py-2 text-lg md:text-2xl font-bold text-[#2d7a7a] border-t-2 border-[#e0e0e0] mt-2 pt-2">
            <span>Total:</span>
            <span>PKR {{ grandTotal.toFixed(2) }}</span>
          </div>
          <div v-if="paymentMethod === 'cash' && cashReceived > 0 && change > 0" class="flex justify-between py-2 text-base md:text-xl font-bold text-[#27ae60] mt-2">
            <span>Change:</span>
            <span>PKR {{ change.toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t-2 border-[#e0e0e0]">
          <h3 class="mb-4 text-lg md:text-xl font-bold text-[#2c3e50]">Payment Method</h3>
          <div class="flex gap-2 mb-4">
            <button
              :class="['flex-1 px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 transition-all', paymentMethod === 'cash' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
              @click="paymentMethod = 'cash'"
            >
              Cash
            </button>
            <button
              :class="['flex-1 px-4 md:px-6 py-3 rounded-lg text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 transition-all', paymentMethod === 'card' ? 'bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]' : 'bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]']"
              @click="paymentMethod = 'card'"
            >
              Card
            </button>
          </div>
          <div v-if="paymentMethod === 'cash'" class="mb-4">
            <label class="block mb-2 font-medium text-sm md:text-base">Cash Received (PKR)</label>
            <input
              v-model.number="cashReceived"
              type="number"
              step="0.01"
              min="0"
              :placeholder="`Enter amount (Total: PKR ${grandTotal.toFixed(2)})`"
              class="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base md:text-lg transition-colors focus:outline-none focus:border-[#2d7a7a]"
              @input="cashReceived = Math.max(0, cashReceived || 0)"
            />
            <div v-if="cashReceived > 0 && cashReceived < grandTotal" class="mt-2 text-sm md:text-base text-[#e74c3c] font-medium">
              Insufficient amount. Need PKR {{ (grandTotal - cashReceived).toFixed(2) }} more.
            </div>
            <div v-if="cashReceived > 0 && change > 0" class="mt-2 text-base md:text-lg text-[#27ae60] font-bold">
              Change: PKR {{ change.toFixed(2) }}
            </div>
          </div>
          <button
            @click="processOrder"
            :disabled="cart.length === 0 || processing || (paymentMethod === 'cash' && cashReceived < grandTotal)"
            class="w-full px-4 py-4 bg-[#27ae60] text-white rounded-lg text-lg md:text-xl font-bold hover:bg-[#229954] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ processing ? 'Processing...' : 'Complete Order' }}
          </button>
        </div>
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
