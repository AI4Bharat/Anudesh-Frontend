import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadCSVProject = createAsyncThunk(
    'DownloadCSVProject/fetchDownloadCSVProject',
    async (projectId, taskStatus ,downloadMetadataToggle,{ dispatch }) => {
        const projectBody={}
        const body = {
            projectBody
        }
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=CSV&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",JSON.stringify(body));
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const DownloadCSVProject = createSlice({
    name: 'DownloadCSVProject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDownloadCSVProject.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchDownloadCSVProject.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchDownloadCSVProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadCSVProject.reducer;
  