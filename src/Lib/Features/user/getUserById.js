import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
import { customFetch } from '../../customFetch';
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchUserById = createAsyncThunk(
  'getUserById/fetchUserById',
  async (userId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getUsers}account/${userId}/fetch/`);
    return customFetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getUserById = createSlice({
  name: 'getUserById',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getUserById.reducer;


