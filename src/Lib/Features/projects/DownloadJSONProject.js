import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadJSONProject = createAsyncThunk(
    'DownloadJSONProject/fetchDownloadJSONProject',
    async (projectId, taskStatus ,downloadMetadataToggle,{ dispatch }) => {
        const projectBody={}
        const body = {
            projectBody
        }
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=JSON&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",body);
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const DownloadJSONProject = createSlice({
    name: 'DownloadJSONProject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDownloadJSONProject.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDownloadJSONProject.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchDownloadJSONProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadJSONProject.reducer;
  