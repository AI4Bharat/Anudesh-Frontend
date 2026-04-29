import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
    data: [],
    status: 'idle',
    error: null,
  };
  
  export const fetchExportProjectButton = createAsyncThunk(
    'GetExportProjectButton/fetchExportProjectButton',
    async ({projectId,instanceId = -1,datasetId ,save_type}) => {
        const body =  export_dataset_instance_id !== -1 ? {
            export_dataset_instance_id: export_dataset_instance_id
           
          } : {}
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/project_export/`,"POST",JSON.stringify(body));
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  
  const GetExportProjectButton = createSlice({
    name: 'GetExportProjectButton',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchExportProjectButton.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchExportProjectButton.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchExportProjectButton.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default GetExportProjectButton.reducer;
  