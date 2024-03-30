import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceProjectReport = createAsyncThunk(
  'WorkspaceProjectReport/fetchWorkspaceProjectReport',
  async ({workspaceId, projectType, language, sendMail, reportsType,}) => {
    const body = language === "all" ? {
        project_type: projectType,
        reports_type: reportsType,
        send_mail: sendMail,
      } : {
          project_type: projectType,
          tgt_language: language,
          reports_type: reportsType,
          send_mail: sendMail,
        };
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${workspaceId}/project_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const WorkspaceProjectReport = createSlice({
  name: 'WorkspaceProjectReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceProjectReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceProjectReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceProjectReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default WorkspaceProjectReport.reducer;
