import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';

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
    const params = fetchParams("/projects/", "POST", body);
    return fetch(params.url, params.options)
        .then(response => response.json())
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
      }
});

export default projectsSlice.reducer;