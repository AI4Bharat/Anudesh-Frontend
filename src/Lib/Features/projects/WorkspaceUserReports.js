import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceUserReports = createAsyncThunk(
  'WorkspaceUserReports/fetchWorkspaceUserReports',
async ({workspaceId, projectType, fromDate, toDate, language,sendMail, reportsType,reportfilter}) => {
    const body = language === "all" ? {
        project_type: projectType,
        from_date: fromDate,
        to_date: toDate,
        reports_type: reportsType,
        send_mail: sendMail,
        ...(reportfilter !== "AllStage" && {project_progress_stage: reportfilter}),
      } : {
          project_type: projectType,
          from_date: fromDate,
          to_date: toDate,
          tgt_language: language,
          reports_type: reportsType,
          send_mail: sendMail,
          ...(reportfilter !== "AllStage" && {project_progress_stage: reportfilter}),
  
      }
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}/user_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const WorkspaceUserReports = createSlice({
  name: 'WorkspaceUserReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceUserReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceUserReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceUserReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default WorkspaceUserReports.reducer;
