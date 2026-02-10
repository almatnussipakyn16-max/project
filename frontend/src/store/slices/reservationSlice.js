import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationService } from '../../services';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reservationService.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, { rejectWithValue }) => {
    try {
      const data = await reservationService.create(reservationData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async (data, { rejectWithValue }) => {
    try {
      const result = await reservationService.checkAvailability(data);
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState: {
    list: [],
    current: null,
    availability: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAvailability: (state) => {
      state.availability = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      });
  },
});

export const { clearAvailability } = reservationSlice.actions;
export default reservationSlice.reducer;
