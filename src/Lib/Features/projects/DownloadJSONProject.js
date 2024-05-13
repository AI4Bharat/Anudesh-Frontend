import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: 0,
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadJSONProject = createAsyncThunk(
    'DownloadJSONProject/fetchDownloadJSONProject',
    async ({projectId, taskStatus ,downloadMetadataToggle}) => {
        const projectBody={}
        const body = {
            projectBody
        }
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=JSON&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",JSON.stringify(body));
      return fetch(params.url, params.options)
          .then(response => response.json())
    }
  );
  const jsonDownload =(data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";
      link.click();	
  
  }
  
  
  
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
          jsonDownload(action.payload); 
          state.data += 1; 
        })
        .addCase(fetchDownloadJSONProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadJSONProject.reducer;
  