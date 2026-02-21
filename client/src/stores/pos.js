import { defineStore } from 'pinia'
import api from '../api/axios'

export const usePOSStore = defineStore('pos', {
  state: () => ({
    categories: [],
    menuItems: [],
    cart: [],
    selectedCategory: null,
    orderType: 'dine-in',
    discountType: 'none',
    discountValue: 0,
    paymentMethod: 'cash',
    cashReceived: 0,
    taxConfig: { rates: { cash: 0.18, card: 0.05 }, isEnabled: true },
    loading: false,
    error: null,
  }),

  getters: {
    filteredMenuItems: (state) => {
      if (!state.selectedCategory) return state.menuItems
      return state.menuItems.filter(
        (item) =>
          item.category &&
          item.category._id === state.selectedCategory &&
          item.isAvailable
      )
    },

    cartTotal: (state) => {
      return state.cart.reduce((sum, item) => sum + item.subtotal, 0)
    },

    discountAmount: (state) => {
      if (state.discountType === 'flat') {
        return Math.min(state.discountValue, state.cartTotal)
      } else if (state.discountType === 'percentage') {
        return (state.cartTotal * state.discountValue) / 100
      }
      return 0
    },

    subtotal: (state) => {
      return state.cartTotal - state.discountAmount
    },

    taxAmount: (state) => {
      if (!state.taxConfig.isEnabled) return 0
      // FBR compliant: GST is calculated on the amount AFTER discount
      const taxRate = state.taxConfig.rates[state.paymentMethod] || 0
      const afterDiscount = state.cartTotal - state.discountAmount
      return afterDiscount * taxRate
    },

    taxRate: (state) => {
      if (!state.taxConfig.isEnabled) return 0
      return state.taxConfig.rates[state.paymentMethod] || 0
    },

    grandTotal: (state) => {
      return state.subtotal + state.taxAmount
    },

    change: (state) => {
      if (state.paymentMethod === 'cash' && state.cashReceived > 0) {
        return Math.max(0, state.cashReceived - (state.subtotal + state.taxAmount))
      }
      return 0
    },
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await api.get('/categories')
        this.categories = response.data.data
        if (this.categories.length > 0 && !this.selectedCategory) {
          this.selectedCategory = this.categories[0]._id
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch categories'
      } finally {
        this.loading = false
      }
    },

    async fetchMenuItems() {
      this.loading = true
      try {
        const response = await api.get('/menu-items?available=true')
        this.menuItems = response.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch menu items'
      } finally {
        this.loading = false
      }
    },

    async fetchTaxConfig() {
      try {
        const response = await api.get('/taxes')
        const tax = response.data.data
        this.taxConfig = {
          rates: tax.rates || { cash: 0.18, card: 0.05 },
          isEnabled: tax.isEnabled,
        }
      } catch (error) {
        console.error('Failed to fetch tax config:', error)
      }
    },

    addToCart(item) {
      // Get category name - handle both populated and unpopulated category
      let categoryName = 'Uncategorized'
      
      if (item.category) {
        // If category is populated object (from backend populate)
        if (item.category.name) {
          categoryName = item.category.name
        }
        // If category is just an ID string, find it in categories array
        else if (typeof item.category === 'string') {
          const category = this.categories.find(cat => 
            cat._id === item.category || 
            cat._id?.toString() === item.category ||
            cat._id?._id?.toString() === item.category
          )
          categoryName = category?.name || 'Uncategorized'
        }
        // If category is an object with _id but no name
        else if (item.category._id) {
          const category = this.categories.find(cat => 
            cat._id?.toString() === item.category._id?.toString() ||
            cat._id?._id?.toString() === item.category._id?.toString()
          )
          categoryName = category?.name || 'Uncategorized'
        }
      }

      const cartItem = {
        menuItem: item._id,
        name: item.name,
        category: categoryName,
        quantity: 1,
        price: item.price,
        variant: null,
        addOns: [],
        subtotal: item.price,
      }

      // Check if same item from same category already exists
      const existingIndex = this.cart.findIndex(
        (ci) => ci.menuItem === item._id && ci.category === cartItem.category
      )

      if (existingIndex >= 0) {
        this.cart[existingIndex].quantity += 1
        this.cart[existingIndex].subtotal =
          this.cart[existingIndex].price * this.cart[existingIndex].quantity
      } else {
        this.cart.push(cartItem)
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1)
    },

    updateCartItemQuantity(index, quantity) {
      if (quantity <= 0) {
        this.removeFromCart(index)
        return
      }
      this.cart[index].quantity = quantity
      this.cart[index].subtotal =
        this.cart[index].price * quantity
    },

    clearCart() {
      this.cart = []
      this.discountType = 'none'
      this.discountValue = 0
      this.cashReceived = 0
    },

    setOrderType(type) {
      this.orderType = type
    },

    setDiscountType(type) {
      this.discountType = type
      if (type === 'none') {
        this.discountValue = 0
      }
    },

    setPaymentMethod(method) {
      this.paymentMethod = method
      // Reset cash received when switching to card
      if (method === 'card') {
        this.cashReceived = 0
      }
    },

    async createOrder() {
      if (this.cart.length === 0) {
        throw new Error('Cart is empty')
      }

      const orderData = {
        items: this.cart,
        orderType: this.orderType,
        discountType: this.discountType,
        discountValue: this.discountValue,
        paymentMethod: this.paymentMethod,
        cashReceived: this.paymentMethod === 'cash' ? this.cashReceived : 0,
        change: this.paymentMethod === 'cash' ? this.change : 0,
      }

      try {
        const response = await api.post('/orders', orderData)
        // Clear cart immediately after successful order
        this.clearCart()
        return response.data
      } catch (error) {
        throw new Error(
          error.response?.data?.message || 'Failed to create order'
        )
      }
    },
  },
})

