import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchOrganizationProjectReports = createAsyncThunk(
  'GetOrganizationProjectReports/fetchOrganizationProjectReports',
  async ({orgId, projectType, targetLanguage, userId, sendMail, sortByColumn, descOrder}) => {
    const body = {
        project_type: projectType,
      tgt_language: targetLanguage === "all" ? undefined : targetLanguage,
      sort_by_column_name: sortByColumn ?? undefined,
      descending_order: descOrder ?? undefined,
      user_id: userId,
      send_mail: sendMail,
      };
    const params = fetchParams(`${ENDPOINTS.getOrganizations}${orgId}/project_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetOrganizationProjectReports = createSlice({
  name: 'GetOrganizationProjectReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationProjectReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationProjectReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationProjectReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetOrganizationProjectReports.reducer;
