import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDownloadProjectAnnotations = createAsyncThunk(
  'getDownloadProjectAnnotations/fetchDownloadProjectAnnotations',
  async (userId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getUsers}${userId}/get_scheduled_mails/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getDownloadProjectAnnotations = createSlice({
  name: 'getDownloadProjectAnnotations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadProjectAnnotations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDownloadProjectAnnotations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDownloadProjectAnnotations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getDownloadProjectAnnotations.reducer;


