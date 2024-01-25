import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchScheduledMails = createAsyncThunk(
  'GetScheduledMails/fetchScheduledMails',
  async (projectId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/export_project_tasks/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetScheduledMails = createSlice({
  name: 'GetScheduledMails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledMails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduledMails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchScheduledMails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetScheduledMails.reducer;


