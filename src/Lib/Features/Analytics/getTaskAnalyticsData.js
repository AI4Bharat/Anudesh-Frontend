import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};
export const fetchTaskAnalyticsData = createAsyncThunk(
  'getTaskAnalyticsData/fetchTaskAnalyticsData',
  async ({project_type_filter,progressObj}) => {
    let endpoint ;
    const body = progressObj
    project_type_filter=='AllTypes'?
    endpoint = `${ENDPOINTS.getOrganizations}public/1/cumulative_tasks_count/`
    :
    endpoint = `${ENDPOINTS.getOrganizations}public/1/cumulative_tasks_count/?project_type_filter=${project_type_filter}`
    const params = fetchParams(endpoint);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);
const getTaskAnalyticsData = createSlice({
  name: 'getTaskAnalyticsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskAnalyticsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskAnalyticsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTaskAnalyticsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getTaskAnalyticsData.reducer;
