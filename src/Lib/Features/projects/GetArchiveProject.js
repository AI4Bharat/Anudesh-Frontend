import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchArchiveProject = createAsyncThunk(
  'getArchiveProject/fetchArchiveProject',
  async (projectId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/archive/`,"POST");
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getArchiveProject = createSlice({
  name: 'getArchiveProject',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchiveProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArchiveProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchArchiveProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getArchiveProject.reducer;
