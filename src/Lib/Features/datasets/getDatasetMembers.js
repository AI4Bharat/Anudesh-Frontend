import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetMembers = createAsyncThunk(
  'getDatasetMembers/fetchDatasetMembers',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`${
        ENDPOINTS.getDatasets
    }instances/${datasetId}/users/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getDatasetMembers = createSlice({
  name: 'getDatasetMembers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getDatasetMembers.reducer;
