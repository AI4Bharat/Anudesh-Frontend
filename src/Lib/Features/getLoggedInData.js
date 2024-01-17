import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const FetchLoggedInUserData = createAsyncThunk(
  'getLoggedInUserData/FetchLoggedInUserData',
  async (workspaceId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.fetch}me/fetch/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getLoggedInUserData = createSlice({
  name: 'getLoggedInUserData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchLoggedInUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(FetchLoggedInUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(FetchLoggedInUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getLoggedInUserData.reducer;


