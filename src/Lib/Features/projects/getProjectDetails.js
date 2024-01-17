import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjectDetails = createAsyncThunk(
  'getProjectDetails/fetchProjectDetails',
  async (projectId, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getProjectDetails = createSlice({
  name: 'getProjectDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getProjectDetails.reducer;
