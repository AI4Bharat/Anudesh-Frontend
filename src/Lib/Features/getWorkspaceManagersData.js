import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspacesManagersData = createAsyncThunk(
  'getWorkspacesManagersData/fetchWorkspacesManagersData',
  async (workspaceId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}/list-managers/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspacesManagersData = createSlice({
  name: 'getWorkspacesManagersData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesManagersData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspacesManagersData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspacesManagersData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspacesManagersData.reducer;


