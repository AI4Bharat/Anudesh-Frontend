import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchRecentTasks = createAsyncThunk(
  'getRecentTasks/fetchRecentTasks',
  async ({id,task_type, pageNo, filter,countPerPage}) => {
    console.log("step 2");
    let queryString = `${pageNo ? "page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}${id ? "&user_id="+id:""}${task_type ? "&task_type="+task_type:""}`;
     for (let key in filter) {
      if (filter[key] && filter[key] !== -1) {
          queryString +=  `&${key}=${filter[key]}`
      }
    }
    const params = fetchParams(`${ENDPOINTS.getTasks}annotated_and_reviewed_tasks/get_users_recent_tasks/?${queryString}`,"POST");
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getRecentTasks = createSlice({
  name: 'getRecentTasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecentTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRecentTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getRecentTasks.reducer;
