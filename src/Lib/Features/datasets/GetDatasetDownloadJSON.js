import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadJSON = createAsyncThunk(
  'GetDatasetDownloadJSON/fetchDatasetDownloadJSON',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`}${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=JSON`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetDownloadJSON = createSlice({
  name: 'GetDatasetDownloadJSON',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadJSON.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadJSON.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetDownloadJSON.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadJSON.reducer;
