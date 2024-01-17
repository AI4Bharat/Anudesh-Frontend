import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceDetails = createAsyncThunk(
  'getWorkspaceDetails/fetchWorkspaceDetails',
  async (workspaceId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspaceDetails = createSlice({
  name: 'getWorkspaceDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspaceDetails.reducer;
