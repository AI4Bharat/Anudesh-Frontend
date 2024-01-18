import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchOrganizationUsers = createAsyncThunk(
  'getOrganizationUsers/fetchOrganizationUsers',
  async (orgId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getOrganizations}${orgId}/users/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getOrganizationUsers = createSlice({
  name: 'getOrganizationUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getOrganizationUsers.reducer;
