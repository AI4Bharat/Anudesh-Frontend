import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetProjects = createAsyncThunk(
  'GetDatasetProjects/fetchDatasetProjects',
  async (datasetId, { dispatch }) => {
    
    const params = fetchParams(`${
        ENDPOINTS.getDatasets
    }instances/${datasetId}/projects/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetProjects = createSlice({
  name: 'GetDatasetProjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetProjects.reducer;
