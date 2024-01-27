import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetSearchPopup = createAsyncThunk(
  'DatasetSearchPopup/fetchDatasetSearchPopup',
  async (taskObj, { dispatch }) => {
    const body ={taskObj}
    const params = fetchParams(`${ENDPOINTS.getDatasets}dataitems/get_data_items/`,"POST",body);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const DatasetSearchPopup = createSlice({
  name: 'DatasetSearchPopup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetSearchPopup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetSearchPopup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetSearchPopup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default DatasetSearchPopup.reducer;
