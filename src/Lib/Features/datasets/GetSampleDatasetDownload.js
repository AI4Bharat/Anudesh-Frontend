import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: 0,
  status: 'idle',
  error: null,
};


export const fetchSampleDatasetDownload = createAsyncThunk(
  'SampleDatasetDownload/fetchSampleDatasetDownload',
  async (datasetId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/${datasetId}/downloadsampledataset`);
    return fetch(params.url, params.options)
        .then(response => response.text())
  }
);

function downloadCSV(content) {
  if (!content || content.length === 0) {
    return;
  }

  const downloadLink = document.createElement("a");
  const blob = new Blob(["\ufeff", content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "sampleDataset.csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const GetSampleDatasetDownload = createSlice({
  name: 'GetSampleDatasetDownload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSampleDatasetDownload.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSampleDatasetDownload.fulfilled, (state, action) => {
        state.status = 'succeeded';
        downloadCSV(action.payload);
        state.data += 1;
      })
      .addCase(fetchSampleDatasetDownload.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetSampleDatasetDownload.reducer;