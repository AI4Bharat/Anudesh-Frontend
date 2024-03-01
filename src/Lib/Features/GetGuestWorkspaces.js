import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchGuestWorkspaceData = createAsyncThunk(
  'getGuestWorkspace/fetchGuestWorkspaceData',
  async (pageNumber, { dispatch }) => {
    //list_guest_workspaces
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}`);
    return fetch(params.url, params.options)
      .then(response => response.json())
  }
);

const getGuestWorkspace = createSlice({
  name: 'getGuestWorkspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuestWorkspaceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGuestWorkspaceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchGuestWorkspaceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getGuestWorkspace.reducer;



