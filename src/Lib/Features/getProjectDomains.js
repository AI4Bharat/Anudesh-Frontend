import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint"
import { customFetch } from '../customFetch';
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjectDomains = createAsyncThunk(
  'getProjectDomains/fetchProjectDomains',
  async (pageNumber, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getProjects}types/`);
    return customFetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getProjectDomains = createSlice({
  name: 'getProjectDomains',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDomains.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectDomains.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjectDomains.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getProjectDomains.reducer;
