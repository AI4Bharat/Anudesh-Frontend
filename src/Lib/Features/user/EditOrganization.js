import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const FetchEditOrganization = createAsyncThunk(
  'EditOrganization/FetchEditOrganization',
  async ({orgId, organizationName }) => {
    const body ={
      title:organizationName
    }

    const params = fetchParams(`${ENDPOINTS.getOrganizations}${orgId}/`,"PUT",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const EditOrganization = createSlice({
  name: 'EditOrganization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchEditOrganization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(FetchEditOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(FetchEditOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default EditOrganization.reducer;
