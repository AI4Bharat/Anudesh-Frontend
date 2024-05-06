import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: 0,
  status: 'idle',
  error: null,
};

export const fetchDatasetDownloadCSV = createAsyncThunk(
  'GetDatasetDownloadCSV/fetchDatasetDownloadCSV',
  async (datasetId, { dispatch }) => {
   
    const params = fetchParams(`}${ENDPOINTS.getDatasets}instances/${datasetId}/download/?export_type=CSV`);
    return fetch(params.url, params.options)
        .then(response => response.text())
  }
);
function downloadCSV(content) {
	const downloadLink = document.createElement("a");
	const blob = new Blob(["\ufeff", content]);
	const url = URL.createObjectURL(blob);
	downloadLink.href = url;
	downloadLink.download = "data.csv";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
const GetDatasetDownloadCSV = createSlice({
  name: 'GetDatasetDownloadCSV',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetDownloadCSV.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasetDownloadCSV.fulfilled, (state, action) => {
        state.status = 'succeeded';
        downloadCSV(action.payload); 
          state.data += 1; 
      })
      .addCase(fetchDatasetDownloadCSV.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasetDownloadCSV.reducer;
