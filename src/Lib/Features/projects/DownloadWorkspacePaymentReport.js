import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: 0,
  status: 'idle',
  error: null,
};

const triggerCsvDownload = (content, filename) => {
  const downloadLink = document.createElement("a");
  const blob = new Blob(["﻿", content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};

export const fetchDownloadWorkspacePaymentReport = createAsyncThunk(
  'DownloadWorkspacePaymentReport/fetchDownloadWorkspacePaymentReport',
  async ({ orgId, userId, projectType, participationTypes, fromDate, toDate }) => {
    const body = {
      project_type: projectType,
      participation_types: participationTypes,
      user_id: userId,
      from_date: fromDate,
      to_date: toDate,
      download_csv: true,
    };
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}${orgId}/send_user_analytics/`, "POST", JSON.stringify(body));
    const response = await fetch(params.url, params.options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to download report");
    }
    const disposition = response.headers.get("Content-Disposition");
    const match = disposition && disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : "payment_report.csv";
    const content = await response.text();
    return { content, filename };
  }
);

const DownloadWorkspacePaymentReport = createSlice({
  name: 'DownloadWorkspacePaymentReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadWorkspacePaymentReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDownloadWorkspacePaymentReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        triggerCsvDownload(action.payload.content, action.payload.filename);
        state.data += 1;
      })
      .addCase(fetchDownloadWorkspacePaymentReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default DownloadWorkspacePaymentReport.reducer;
