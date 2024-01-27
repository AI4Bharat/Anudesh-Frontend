import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadTSV = createAsyncThunk(
  'GetDatasetDownloadTSV/fetchDatasetDownloadTSV',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`}${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=TSV`);
    return fetch(params.url, params.options)
        .then(response => response.TSV())
  }
);

const GetDatasetDownloadTSV = createSlice({
  name: 'GetDatasetDownloadTSV',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadTSV.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadTSV.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetDownloadTSV.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadTSV.reducer;
