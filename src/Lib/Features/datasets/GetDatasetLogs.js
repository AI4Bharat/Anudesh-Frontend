import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetLogs = createAsyncThunk(
  'GetDatasetLogs/fetchDatasetLogs',
  async ({instanceId, taskName}) => {
   
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${instanceId}/get_async_task_results/?task_name=${taskName}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetLogs = createSlice({
  name: 'GetDatasetLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetLogs.reducer;
