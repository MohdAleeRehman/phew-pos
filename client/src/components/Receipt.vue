<template>
  <div class="receipt-container" ref="receiptRef">
    <div class="receipt">
      <!-- Receipt Header -->
      <div class="receipt-header">
        <img :src="logo" alt="PHEW Logo" class="receipt-logo-img" />
        <p class="receipt-subtitle">Cafe</p>
        <p class="receipt-address">Point of Sale Receipt</p>
      </div>

      <!-- Order Info -->
      <div class="receipt-section">
        <div class="receipt-row">
          <span>Order #:</span>
          <span>{{ order.orderNumber }}</span>
        </div>
        <div class="receipt-row">
          <span>Date:</span>
          <span>{{ formatDate(order.createdAt) }}</span>
        </div>
        <div class="receipt-row">
          <span>Type:</span>
          <span class="capitalize">{{ order.orderType }}</span>
        </div>
        <div class="receipt-row">
          <span>Payment:</span>
          <span class="capitalize">{{ order.paymentMethod }}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Items -->
      <div class="receipt-section">
        <div class="receipt-items-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </div>
        <div
          v-for="(item, index) in order.items"
          :key="index"
          class="receipt-item"
        >
          <div class="receipt-item-name">
            <div>{{ item.name }}</div>
            <div class="receipt-item-category">{{ item.category }}</div>
          </div>
          <span class="receipt-item-qty">{{ item.quantity }}</span>
          <span class="receipt-item-price">PKR {{ item.subtotal.toFixed(2) }}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Summary -->
      <div class="receipt-section">
        <div class="receipt-row">
          <span>Subtotal:</span>
          <span>PKR {{ order.subtotal.toFixed(2) }}</span>
        </div>
        <div v-if="order.discountAmount > 0" class="receipt-row">
          <span>Discount:</span>
          <span>-PKR {{ order.discountAmount.toFixed(2) }}</span>
        </div>
        <div v-if="order.taxAmount > 0" class="receipt-row">
          <span>GST ({{ (order.taxRate * 100).toFixed(0) }}%):</span>
          <span>PKR {{ order.taxAmount.toFixed(2) }}</span>
        </div>
        <div class="receipt-row receipt-total">
          <span>Total:</span>
          <span>PKR {{ order.total.toFixed(2) }}</span>
        </div>
        <div v-if="order.paymentMethod === 'cash' && order.cashReceived > 0" class="receipt-row">
          <span>Cash Received:</span>
          <span>PKR {{ order.cashReceived.toFixed(2) }}</span>
        </div>
        <div v-if="order.paymentMethod === 'cash' && order.change > 0" class="receipt-row receipt-change">
          <span>Change:</span>
          <span>PKR {{ order.change.toFixed(2) }}</span>
        </div>
        <div v-else-if="order.paymentMethod === 'cash' && order.cashReceived > 0 && order.change === 0" class="receipt-row">
          <span>Change:</span>
          <span>PKR 0.00</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Footer -->
      <div class="receipt-footer">
        <p>Thank you for your visit!</p>
        <p class="receipt-footer-small">Have a great day!</p>
      </div>
    </div>
  </div>
</template>

<script>
import logo from '../assets/logo.jpeg'

export default {
  name: 'Receipt',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const formatDate = (date) => {
      if (!date) return new Date().toLocaleString()
      const d = new Date(date)
      return d.toLocaleString('en-PK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return {
      formatDate,
      logo,
    }
  },
}
</script>

<style scoped>
.receipt-container {
  padding: 20px;
  background: white;
}

.receipt {
  max-width: 300px;
  margin: 0 auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #000;
}

.receipt-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px dashed #000;
  padding-bottom: 15px;
}

.receipt-logo-img {
  max-width: 150px;
  height: auto;
  margin: 0 auto 10px;
  display: block;
}

.receipt-subtitle {
  font-size: 14px;
  margin: 5px 0;
  font-weight: bold;
}

.receipt-address {
  font-size: 10px;
  margin: 5px 0;
}

.receipt-section {
  margin: 15px 0;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 12px;
}

.receipt-total {
  font-weight: bold;
  font-size: 14px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #000;
}

.receipt-change {
  font-weight: bold;
  font-size: 14px;
  color: #27ae60;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #000;
}

.receipt-divider {
  border-top: 1px dashed #000;
  margin: 15px 0;
}

.receipt-items-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #000;
}

.receipt-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  margin: 8px 0;
  font-size: 11px;
}

.receipt-item-name {
  display: flex;
  flex-direction: column;
}

.receipt-item-category {
  font-size: 9px;
  color: #666;
  font-style: italic;
  margin-top: 2px;
}

.receipt-item-qty {
  text-align: center;
}

.receipt-item-price {
  text-align: right;
}

.receipt-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px dashed #000;
  font-size: 11px;
}

.receipt-footer-small {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
}

.capitalize {
  text-transform: capitalize;
}

/* Print Styles */
@media print {
  .receipt-container {
    padding: 0;
  }
  
  .receipt {
    max-width: 100%;
  }
  
  @page {
    margin: 0.5cm;
    size: 80mm auto;
  }
}
</style>

