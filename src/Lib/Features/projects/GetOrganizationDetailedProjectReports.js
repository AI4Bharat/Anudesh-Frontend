import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchOrganizationDetailedProjectReports = createAsyncThunk(
  'getOrganizationDetailedProjectReports/fetchOrganizationDetailedProjectReports',
  async ({orgId, projectType, userId, statistics}) => {
    const body = {
        organization_id: orgId,
        user_id: userId,
        project_type: projectType,
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

const getOrganizationDetailedProjectReports = createSlice({
  name: 'getOrganizationDetailedProjectReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationDetailedProjectReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationDetailedProjectReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationDetailedProjectReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getOrganizationDetailedProjectReports.reducer;
