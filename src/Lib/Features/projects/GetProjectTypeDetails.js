import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjectTypeDetails = createAsyncThunk(
  'GetProjectTypeDetails/fetchProjectTypeDetails',
  async (projecType, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getProjects}types/?project_type=${projecType}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetProjectTypeDetails = createSlice({
  name: 'GetProjectTypeDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTypeDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectTypeDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjectTypeDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetProjectTypeDetails.reducer;
