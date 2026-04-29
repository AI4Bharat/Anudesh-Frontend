import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: 0,
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadTSVProject = createAsyncThunk(
    'DownloadTSVProject/fetchDownloadTSVProject',
    async ({projectId, taskStatus ,downloadMetadataToggle}) => {
        const projectBody={}
        const body = {
            projectBody
        }
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=CSV&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",JSON.stringify(body));
      return fetch(params.url, params.options)
          .then(response => response.text())
    }
  );
  const TsvDownload=(content)=> {
    const downloadLink = document.createElement("a");
    const blob = new Blob(["\ufeff", content]);
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.tsv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
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
          TsvDownload(action.payload); 
          state.data += 1; 
        })
        .addCase(fetchDownloadTSVProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadTSVProject.reducer;
  