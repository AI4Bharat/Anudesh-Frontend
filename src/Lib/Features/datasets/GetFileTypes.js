import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchFileTypes = createAsyncThunk(
  'GetFileTypes/fetchFileTypes',
  async ( ) => {
    
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/accepted_filetypes/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetFileTypes = createSlice({
  name: 'GetFileTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFileTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFileTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetFileTypes.reducer;
