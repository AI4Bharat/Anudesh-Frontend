import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchUserDetails = createAsyncThunk(
  'getUserDetails/fetchUserDetails',
  async ( { dispatch }) => {
    
    const params = fetchParams(`${ENDPOINTS.fetch}user_details`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getUserDetails = createSlice({
  name: 'getUserDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getUserDetails.reducer;
