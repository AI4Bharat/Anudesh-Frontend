import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchOrganizationUserReports = createAsyncThunk(
  'GetOrganizationUserReports/fetchOrganizationUserReports',
  async (orgId, projectType, startDate, endDate,reportsType, targetLanguage, sendMail, onlyReviewProjects,sortByColumn, descOrder, { dispatch }) => {
    const body = {
        project_type: projectType,
        from_date: startDate,
        to_date: endDate,
        tgt_language: targetLanguagetargetLanguage === "all" ? undefined : targetLanguage,
        ...{project_progress_stage: onlyReviewProjects},
        sort_by_column_name: sortByColumn ?? undefined,
        descending_order: descOrder ?? undefined,
        reports_type: reportsType,
        send_mail: sendMail ?? false,
      };
    const params = fetchParams(`${ENDPOINTS.getOrganizations}${orgId}/user_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetOrganizationUserReports = createSlice({
  name: 'GetOrganizationUserReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationUserReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationUserReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationUserReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetOrganizationUserReports.reducer;
