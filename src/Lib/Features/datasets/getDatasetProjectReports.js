import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetProjectReports = createAsyncThunk(
  'getDatasetProjectReports/fetchDatasetProjectReports',
async ({datasetId, projectType, language}) => {
    const body=language === "all" ? {
        project_type: projectType
      } : {
        project_type: projectType,
        tgt_language: language,
     }
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}/project_analytics/`,"POST",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getDatasetProjectReports = createSlice({
  name: 'getDatasetProjectReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetProjectReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetProjectReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasetProjectReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getDatasetProjectReports.reducer;
