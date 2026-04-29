import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
import { customFetch } from '../../customFetch';
const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchDatasetByType = createAsyncThunk(
    'GetDatasetByType/fetchDatasetType',
    async (datasetType) => {
      const params = fetchParams(`${ENDPOINTS.getDatasets}instances/?dataset_type=${datasetType}`);
      return customFetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const GetDatasetByType = createSlice({
    name: 'GetDatasetByType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDatasetByType.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDatasetByType.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchDatasetByType.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default GetDatasetByType.reducer;
  