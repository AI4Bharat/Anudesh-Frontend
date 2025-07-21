import fetchParams from '@/Lib/fetchParams';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    error: null,
    newProject: {
      status: 'idle',
      error: null,
      res: null,
    },
    projects: [],
};

export const createProject = createAsyncThunk('projects/createProject', async (body) => {
    const params = fetchParams("/projects/", "POST", JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
});

export const setPasswordForProject = createAsyncThunk('projects/setPasswordForProject', async ({ projectId, password }) => {
  const params = fetchParams(`/projects/${projectId}/set_password/`, 'POST', JSON.stringify({ password }));
  const response = await fetch(params.url, params.options);
  if (!response.ok) {
    throw new Error('Failed to set password');
  }
  return response.json();
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(createProject.fulfilled, (state, action) => {
            state.newProject.status = 'succeeded'
            state.newProject.res = action.payload
          })
          .addCase(createProject.pending, (state, action) => {
            state.newProject.status = 'loading'
          })
          .addCase(createProject.rejected, (state, action) => {
            state.newProject.status = 'failed'
            state.newProject.error = action.error.message
          })
          .addCase(setPasswordForProject.fulfilled, (state, action) => {
            state.newProject.status = 'passwordSetSucceeded';
          })
          .addCase(setPasswordForProject.pending, (state, action) => {
            state.newProject.status = 'passwordSetting';
          })
          .addCase(setPasswordForProject.rejected, (state, action) => {
            state.newProject.status = 'passwordSetFailed';
            state.newProject.error = action.error.message;
          });
      }
});

export default projectsSlice.reducer;
