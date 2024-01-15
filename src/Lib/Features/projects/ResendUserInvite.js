import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchResendUserInvite = createAsyncThunk(
  'ResendUserInvite/fetchResendUserInvite',
  async (projectId,projectObj,type, { dispatch }) => {
    let queryStr = type == "PROJECT_SUPERCHECKER" ? "remove_superchecker" : "remove_reviewer";
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/${queryStr}/`,method='POST',projectObj);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const ResendUserInvite = createSlice({
  name: 'ResendUserInvite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResendUserInvite.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResendUserInvite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchResendUserInvite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ResendUserInvite.reducer;
