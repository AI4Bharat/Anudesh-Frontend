import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
import { customFetch } from '../customFetch';
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceCreateData = createAsyncThunk(
  'getWorkspaceData/fetchWorkspaceCreateData',
  async (pageNo, records, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}user-workspaces/loggedin-user-workspaces/`);
    return customFetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getWorkspaceData = createSlice({
  name: 'getWorkspaceData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceCreateData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceCreateData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceCreateData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getWorkspaceData.reducer;
