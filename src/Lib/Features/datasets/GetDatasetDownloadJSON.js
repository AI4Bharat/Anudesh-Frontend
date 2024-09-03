import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadJSON = createAsyncThunk(
  'GetDatasetDownloadJSON/fetchDatasetDownloadJSON',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=JSON`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);
function DownloadJSON(data) {
	const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
		JSON.stringify(data)
	  )}`;
	  const link = document.createElement("a");
	  link.href = jsonString;
	  link.download = "data.json";
	  link.click();	  

}



const GetDatasetDownloadJSON = createSlice({
  name: 'GetDatasetDownloadJSON',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadJSON.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadJSON.fulfilled, (state, action) => {
        state.status = 'succeeded';
        DownloadJSON(action.payload); 
          state.data += 1; 
      })
      .addCase(fetchDatasetDownloadJSON.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadJSON.reducer;
