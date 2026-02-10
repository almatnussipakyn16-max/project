import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    restaurant: null,
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      if (!state.restaurant || state.restaurant.id === item.restaurant.id) {
        state.restaurant = item.restaurant;
        
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      if (state.items.length === 0) {
        state.restaurant = null;
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
      
      if (state.items.length === 0) {
        state.restaurant = null;
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.subtotal = 0;
      state.tax = 0;
      state.deliveryFee = 0;
      state.discount = 0;
      state.total = 0;
    },
    
    applyDiscount: (state, action) => {
      state.discount = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      
      state.tax = state.subtotal * 0.1;
      state.deliveryFee = state.subtotal > 30 ? 0 : 5;
      
      state.total = state.subtotal + state.tax + state.deliveryFee - state.discount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyDiscount,
} = cartSlice.actions;
export default cartSlice.reducer;
