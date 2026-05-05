import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchParams from "../../fetchParams";
import ENDPOINTS from "../../../config/apiendpoint";

const initialState = {
  data: 0,
  status: "idle",
  error: null,
};

export const fetchDownloadJSONProject = createAsyncThunk(
  "DownloadJSONProject/fetchDownloadJSONProject",
  async ({ projectId, taskStatus, downloadMetadataToggle, email }) => {
    const emailParam = email ? "&email=true" : "";

    const params = fetchParams(
      `${ENDPOINTS.getProjects}${projectId}/download/?export_type=JSON&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}${emailParam}`,
      "POST"
    );

    const response = await fetch(params.url, params.options);

    if (!response.ok) {
      throw new Error("JSON export failed");
    }

    if (email) {
      return { emailed: true };
    }

    const json = await response.json();
    return { emailed: false, content: json };
  }
);

const jsonDownload = (data) => {
  const link = document.createElement("a");
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
};

const DownloadJSONProject = createSlice({
  name: "DownloadJSONProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadJSONProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDownloadJSONProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (!action.payload.emailed) {
          jsonDownload(action.payload.content);
        }
        state.data += 1;
      })
      .addCase(fetchDownloadJSONProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default DownloadJSONProject.reducer;
