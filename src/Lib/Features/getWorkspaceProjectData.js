import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceProjectData = createAsyncThunk(
  'getWorkspaceProjectData/fetchWorkspaceProjectData',
  async (workspaceId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}/projects/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspaceProjectData = createSlice({
  name: 'getWorkspaceProjectData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceProjectData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceProjectData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceProjectData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspaceProjectData.reducer;
