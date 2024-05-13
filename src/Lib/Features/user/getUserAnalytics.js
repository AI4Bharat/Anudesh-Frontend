import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchUserAnalytics = createAsyncThunk(
  'GetUserAnalytics/fetchUserAnalytics',
  async ({progressObj}) => {
    
    const params = fetchParams(`${ENDPOINTS.getUsers}user_analytics/`,"POST",JSON.stringify(progressObj));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetUserAnalytics = createSlice({
  name: 'GetUserAnalytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetUserAnalytics.reducer;
