import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services';

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await orderService.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderService.create(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const applyPromoCode = createAsyncThunk(
  'orders/applyPromo',
  async ({ orderId, code }, { rejectWithValue }) => {
    try {
      const data = await orderService.applyPromo(orderId, code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const trackOrder = createAsyncThunk(
  'orders/track',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await orderService.trackOrder(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await orderService.cancelOrder(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    tracking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.tracking = action.payload;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;
