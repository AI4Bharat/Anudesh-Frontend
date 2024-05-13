import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};
export const fetchMetaAnalyticsData = createAsyncThunk(
  'getMetaAnalyticsData/fetchMetaAnalyticsData',
  async ({project_type_filter,progressObj}) => {
    let endpoint ;
    const body = progressObj
    project_type_filter=='AllTypes'?
    endpoint = `${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true`
    :
    endpoint = `${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true&project_type_filter=${project_type_filter}`
    const params = fetchParams(endpoint);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);
const getMetaAnalyticsData = createSlice({
  name: 'getMetaAnalyticsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetaAnalyticsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMetaAnalyticsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchMetaAnalyticsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default getMetaAnalyticsData.reducer;