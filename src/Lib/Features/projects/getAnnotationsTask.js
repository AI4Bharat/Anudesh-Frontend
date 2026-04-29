import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchAnnotationsTask = createAsyncThunk(
  'getAnnotationsTask/fetchAnnotationsTask',
  async (taskId) => {
    
    const params = fetchParams(`${ENDPOINTS.getTasks}${taskId}/annotations/`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);


const getAnnotationsTask = createSlice({
  name: 'getAnnotationsTask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotationsTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnnotationsTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAnnotationsTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getAnnotationsTask.reducer;
