import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceData = createAsyncThunk(
  'getWorkspace/fetchWorkspaceData',
  async (pageNumber, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspace = createSlice({
  name: 'getWorkspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspace.reducer;
