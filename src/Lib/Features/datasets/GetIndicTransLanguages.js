import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchIndicTransLanguages = createAsyncThunk(
  'GetIndicTransLanguages/fetchIndicTransLanguages',
  async ( { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.functions}get_indic_trans_supported_languages`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetIndicTransLanguages = createSlice({
  name: 'GetIndicTransLanguages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndicTransLanguages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIndicTransLanguages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchIndicTransLanguages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetIndicTransLanguages.reducer;
