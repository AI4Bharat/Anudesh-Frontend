import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';
import ENDPOINTS from "../../config/apiendpoint";

const initialState = {
  data: [], 
  authenticatedWorkspaces: [], 
  status: 'idle',
  error: null,
};

export const fetchGuestWorkspaceData = createAsyncThunk(
  'getGuestWorkspace/fetchGuestWorkspaceData',
  async (pageNumber) => {
    const params = fetchParams(`${ENDPOINTS.getWorkspaces}list_guest_workspaces/`);
    return fetch(params.url, params.options)
      .then((response) => response.json());
  }
);

const getGuestWorkspaces = createSlice({
  name: 'getGuestWorkspaces',
  initialState,
  reducers: {
    addAuthenticatedWorkspace: (state, action) => {
      const workspaceId = action.payload;
      if (!state.authenticatedWorkspaces.includes(workspaceId)) {
        state.authenticatedWorkspaces.push(workspaceId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuestWorkspaceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGuestWorkspaceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchGuestWorkspaceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addAuthenticatedWorkspace } = getGuestWorkspaces.actions;
export default getGuestWorkspaces.reducer;
