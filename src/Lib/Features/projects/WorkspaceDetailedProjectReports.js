import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchWorkspaceDetailedProjectReports = createAsyncThunk(
  'WorkspaceDetailedProjectReports/fetchWorkspaceDetailedProjectReports',
  async ({workId, projectType, userId, statistics, language}) => {
    const body = {
        workspace_id: workId,
      user_id: userId,
      project_type: projectType,
      language: language
      };
  
      if(statistics === 1){
        body.annotation_statistics = true;
      }else if(statistics === 2){
        body["meta-info_statistics"] = true;
      }else if(statistics === 3){
        body.complete_statistics = true;
      }
    const params = fetchParams(`/functions/schedule_project_reports_email`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const WorkspaceDetailedProjectReports = createSlice({
  name: 'WorkspaceDetailedProjectReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceDetailedProjectReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaceDetailedProjectReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkspaceDetailedProjectReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default WorkspaceDetailedProjectReports.reducer;
