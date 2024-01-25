import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetsByType = createAsyncThunk(
  'getDatasetsByType/fetchDatasetsByType',
  async (datasetType, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/?dataset_type=${datasetType}`,"POST");
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getDatasetsByType = createSlice({
  name: 'getDatasetsByType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetsByType.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetsByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetsByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getDatasetsByType.reducer;
