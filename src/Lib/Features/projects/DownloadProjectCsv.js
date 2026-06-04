import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"


const initialState = {
  data: 0,
  status: 'idle',
  error: null,
};

export const fetchDownloadCSVProject = createAsyncThunk(
  "DownloadCSVProject/fetchDownloadCSVProject",
  async ({ projectId, taskStatus, downloadMetadataToggle, email = false }) => {

    const query = new URLSearchParams({
      export_type: "CSV",
      task_status: taskStatus,
      include_input_data_metadata_json: downloadMetadataToggle,
    });

    if (email) {
      query.append("email", "true");
    }

    const params = fetchParams(
      `${ENDPOINTS.getProjects}${projectId}/download/?${query.toString()}`,
      "GET"   
    );

    const response = await fetch(params.url, params.options);

    if (email) {
      return { email: true };
    }

    return { email: false, content: await response.text() };
  }
);
const CsvDownload = (content) => {
  const downloadLink = document.createElement("a");
  const blob = new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  downloadLink.href = url;
  downloadLink.download = "data.csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
const DownloadCSVProject = createSlice({
  name: "DownloadCSVProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadCSVProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDownloadCSVProject.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (!action.payload.email) {
          CsvDownload(action.payload.content);
        }

        state.data += 1;
      })
      .addCase(fetchDownloadCSVProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default DownloadCSVProject.reducer;