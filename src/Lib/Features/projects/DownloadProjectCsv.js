import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
    data: 0,
    status: 'idle',
    error: null,
  };
  
  export const fetchDownloadCSVProject = createAsyncThunk(
    'DownloadCSVProject/fetchDownloadCSVProject',
    async ({projectId, taskStatus ,downloadMetadataToggle}) => {
      console.log(projectId, taskStatus ,downloadMetadataToggle);
        const projectBody={}
        const body = {}
      const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/download/?export_type=CSV&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`,"POST",JSON.stringify(body));
      return fetch(params.url, params.options)
          .then(response => response.text())
    }
  );
  const CsvDownload = (content) => {
    const downloadLink = document.createElement("a");
    const blob = new Blob(["\ufeff", content]);
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

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
          CsvDownload(action.payload); 
          state.data += 1; 
        })
        .addCase(fetchDownloadCSVProject.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default DownloadCSVProject.reducer;
  