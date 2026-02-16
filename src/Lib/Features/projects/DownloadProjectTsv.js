import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchParams from "../../fetchParams";
import ENDPOINTS from "../../../config/apiendpoint";

const initialState = {
  data: 0,
  status: "idle",
  error: null,
};

export const fetchDownloadTSVProject = createAsyncThunk(
  "DownloadTSVProject/fetchDownloadTSVProject",
  async ({ projectId, taskStatus, downloadMetadataToggle, email }) => {
    const emailParam = email ? "&email=true" : "";

    const params = fetchParams(
      `${ENDPOINTS.getProjects}${projectId}/download/?export_type=TSV&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}${emailParam}`,
      "POST"
    );

    const response = await fetch(params.url, params.options);

    if (!response.ok) {
      throw new Error("TSV export failed");
    }

    if (email) {
      return { emailed: true };
    }

    const text = await response.text();
    return { emailed: false, content: text };
  }
);

const tsvDownload = (content) => {
  const link = document.createElement("a");
  const blob = new Blob(["\ufeff", content], { type: "text/tab-separated-values" });
  link.href = URL.createObjectURL(blob);
  link.download = "data.tsv";
  link.click();
};

const DownloadTSVProject = createSlice({
  name: "DownloadTSVProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadTSVProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDownloadTSVProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (!action.payload.emailed) {
          tsvDownload(action.payload.content);
        }
        state.data += 1;
      })
      .addCase(fetchDownloadTSVProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default DownloadTSVProject.reducer;
