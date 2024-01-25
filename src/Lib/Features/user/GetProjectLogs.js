import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjectLogs = createAsyncThunk(
  'GetProjectLogs/fetchProjectLogs',
  async (projectId,taskName, { dispatch }) => {

    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/get_async_task_results/?task_name=${taskName}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetProjectLogs = createSlice({
  name: 'GetProjectLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjectLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetProjectLogs.reducer;
