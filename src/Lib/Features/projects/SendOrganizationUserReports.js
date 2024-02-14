import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchSendOrganizationUserReports = createAsyncThunk(
  'SendOrganizationUserReports/fetchSendOrganizationUserReports',
  async (orgId, userId, projectType, participationTypes, fromDate, toDate, { dispatch }) => {
    const body = {
        project_type: projectType,
        participation_types: participationTypes,
        user_id: userId,
        from_date: fromDate,
        to_date: toDate
      };
    const params = fetchParams(`${ENDPOINTS.getOrganizations}${orgId}/send_user_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const SendOrganizationUserReports = createSlice({
  name: 'SendOrganizationUserReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendOrganizationUserReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSendOrganizationUserReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSendOrganizationUserReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SendOrganizationUserReports.reducer;
