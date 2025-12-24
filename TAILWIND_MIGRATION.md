# Tailwind CSS Migration Guide

## Installation

Run this command in the `client` directory:
```bash
cd client
npm install tailwindcss @tailwindcss/vite
```

## Configuration

✅ vite.config.js - Already updated
✅ style.css - Already updated with @import "tailwindcss"

## Color Palette (for reference)

- Primary Teal: `#2d7a7a` → `bg-[#2d7a7a]` or `text-[#2d7a7a]`
- Dark Teal: `#1a5a5a` → `bg-[#1a5a7a]` or `text-[#1a5a5a]`
- Accent Orange: `#ff6b35` → `bg-[#ff6b35]` or `text-[#ff6b35]`
- Background Gray: `#f5f5f5` → `bg-[#f5f5f5]`
- Light Gray: `#e0e0e0` → `bg-[#e0e0e0]` or `border-[#e0e0e0]`
- Text Dark: `#2c3e50` → `text-[#2c3e50]`
- Text Light: `#7f8c8d` → `text-[#7f8c8d]`
- Success: `#27ae60` → `bg-[#27ae60]` or `text-[#27ae60]`
- Danger: `#e74c3c` → `bg-[#e74c3c]` or `text-[#e74c3c]`
- Warning: `#f39c12` → `bg-[#f39c12]` or `text-[#f39c12]`

## Common Class Conversions

- `.btn` → `px-6 py-3 rounded-lg text-base font-medium inline-flex items-center justify-center gap-2 transition-all`
- `.btn-primary` → `bg-[#2d7a7a] text-white hover:bg-[#1a5a5a]`
- `.btn-secondary` → `bg-[#e0e0e0] text-[#2c3e50] hover:bg-[#d0d0d0]`
- `.btn-danger` → `bg-[#e74c3c] text-white hover:bg-[#c0392b]`
- `.btn-success` → `bg-[#27ae60] text-white hover:bg-[#229954]`
- `.input` → `w-full px-3 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#2d7a7a]`
- `.card` → `bg-white rounded-xl p-6 shadow-md`
- `.error` → `text-red-600 bg-red-50 p-4 rounded-lg`
- `.success` → `text-green-600 bg-green-50 p-4 rounded-lg`

## Components Converted

✅ Login.vue
✅ MainLayout.vue
✅ POS.vue
✅ Orders.vue
✅ Reports.vue
✅ Menu.vue
✅ Settings.vue
✅ Inventory.vue

**All components have been successfully converted to Tailwind CSS v4.1!**

