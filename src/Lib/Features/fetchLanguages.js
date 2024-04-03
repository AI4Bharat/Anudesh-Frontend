import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchLanguages = createAsyncThunk(
  'getLanguages/fetchLanguages',
  async (pageNumber) => {
    const params = fetchParams(`${ENDPOINTS.getLanguages}fetch/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getLanguages = createSlice({
  name: 'getLanguages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getLanguages.reducer;
