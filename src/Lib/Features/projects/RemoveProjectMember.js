import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
import { customFetch } from '../../customFetch';
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchRemoveProjectMember = createAsyncThunk(
  'RemoveProjectMember/fetchRemoveProjectMember',
  async ({projectId,projectObj}) => {
    const body = {
      ids:projectObj
    }
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/remove_annotator/`,"POST",JSON.stringify(body));
    return customFetch(params.url, params.options)
        .then(response => response.json())
  }
);

const RemoveProjectMember = createSlice({
  name: 'RemoveProjectMember',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRemoveProjectMember.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRemoveProjectMember.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRemoveProjectMember.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default RemoveProjectMember.reducer;
