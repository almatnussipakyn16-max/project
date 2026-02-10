import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantService } from '../../services';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await restaurantService.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await restaurantService.getById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurants/search',
  async (query, { rejectWithValue }) => {
    try {
      const data = await restaurantService.search(query);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrent } = restaurantSlice.actions;

export default restaurantSlice.reducer;
