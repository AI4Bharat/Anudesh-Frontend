import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadCSV = createAsyncThunk(
  'GetDatasetDownloadCSV/fetchDatasetDownloadCSV',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`}${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=CSV`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetDownloadCSV = createSlice({
  name: 'GetDatasetDownloadCSV',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadCSV.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadCSV.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetDownloadCSV.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadCSV.reducer;
