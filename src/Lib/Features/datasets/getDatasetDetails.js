import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDetails = createAsyncThunk(
  'GetDatasetDetails/fetchDatasetDetails',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetDetails = createSlice({
  name: 'GetDatasetDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDetails.reducer;
