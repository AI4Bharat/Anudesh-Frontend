import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjectReport = createAsyncThunk(
  'getProjectReport/fetchProjectReport',
  async (projectId, startDate, endDate,reports_type, { dispatch }) => {
    const body ={
        from_date: startDate,
        to_date: endDate,
        reports_type: reports_type,
      };
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/get_analytics/`,"POST",body);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getProjectReport = createSlice({
  name: 'getProjectReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjectReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getProjectReport.reducer;
