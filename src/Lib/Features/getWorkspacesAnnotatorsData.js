import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspacesAnnotatorsData = createAsyncThunk(
  'getWorkspacesAnnotatorsData/fetchWorkspacesAnnotatorsData',
  async ({workspaceId}) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}/members/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspacesAnnotatorsData = createSlice({
  name: 'getWorkspacesAnnotatorsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesAnnotatorsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspacesAnnotatorsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspacesAnnotatorsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspacesAnnotatorsData.reducer;


