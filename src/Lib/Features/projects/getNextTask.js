import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchNextTask = createAsyncThunk(
  'getNextTask/fetchNextTask',
  async ({projectId,projectObj}) => {
    console.log(projectObj,"lll");
    let queryStr = "";
    const labellingMode = window.localStorage.getItem("labellingMode");
    const searchFilters = JSON.parse(window.localStorage.getItem("searchFilters"));
    console.log(JSON.parse(window.localStorage.getItem("searchFilters")),"searchFilterssearchFilters")
    projectObj = projectObj;
    if (window.localStorage.getItem("labelAll") ) {
      Object.keys(searchFilters).forEach((key,index) => {
        let keyValStr = `${key}=${searchFilters[key]}`;
        queryStr += index === 0 ? keyValStr : `&${keyValStr}`;
      });
    }
    const params = fetchParams(`${ENDPOINTS.getProjects}${projectId}/next/?${queryStr}`,"POST",JSON.stringify(projectObj));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getNextTask = createSlice({
  name: 'getNextTask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNextTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNextTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchNextTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getNextTask.reducer;
