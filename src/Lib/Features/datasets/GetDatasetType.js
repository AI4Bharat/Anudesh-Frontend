import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchDatasetType = createAsyncThunk(
    'GetDatasetType/fetchDatasetType',
    async (datasetType) => {
      const params = fetchParams(`${ENDPOINTS.getDatasets}instances/dataset_types/`);
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const GetDatasetType = createSlice({
    name: 'GetDatasetType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDatasetType.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDatasetType.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchDatasetType.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default GetDatasetType.reducer;
  