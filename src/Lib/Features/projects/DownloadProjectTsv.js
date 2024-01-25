import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadTSVProject = createAsyncThunk(
    'DownloadTSVProject/fetchDownloadTSVProject',
    async (projectId, taskStatus ,downloadMetadataToggle,{ dispatch }) => {
        const projectBody={}
        const body = {
            projectBody
        }
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=CSV&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",body);
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const DownloadTSVProject = createSlice({
    name: 'DownloadTSVProject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDownloadTSVProject.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDownloadTSVProject.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchDownloadTSVProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadTSVProject.reducer;
  