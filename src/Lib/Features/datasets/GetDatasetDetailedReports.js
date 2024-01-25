import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDetailedReports = createAsyncThunk(
  'GetDatasetDetailedReports/fetchDatasetDetailedReports',
  async (dataId, projectType, userId, statistics, { dispatch }) => {
    const body={
        dataset_id: dataId,
        user_id: userId,
        project_type: projectType,
      }
      
    if(statistics === 1){
        body.annotation_statistics = true;
      }else if(statistics === 2){
        body["meta-info_statistics"] = true;
      }else if(statistics === 3){
        body.complete_statistics = true;
      };
    const params = fetchParams(`/functions/schedule_project_reports_email`,"POST",body);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasetDetailedReports = createSlice({
  name: 'GetDatasetDetailedReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDetailedReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDetailedReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetDetailedReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDetailedReports.reducer;
