import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: 0,
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadTSV = createAsyncThunk(
  'GetDatasetDownloadTSV/fetchDatasetDownloadTSV',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=TSV`);
    return fetch(params.url, params.options)
        .then(response => response.text())
  }
);

function downloadTSV(content) {
	const downloadLink = document.createElement("a");
	const blob = new Blob(["\ufeff", content]);
	const url = URL.createObjectURL(blob);
	downloadLink.href = url;
	downloadLink.download = "data.tsv";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

const GetDatasetDownloadTSV = createSlice({
  name: 'GetDatasetDownloadTSV',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadTSV.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadTSV.fulfilled, (state, action) => {
        state.status = 'succeeded';
        downloadTSV(action.payload); 
          state.data += 1; 
      })
      .addCase(fetchDatasetDownloadTSV.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadTSV.reducer;
