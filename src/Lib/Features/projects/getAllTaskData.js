import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchAllTaskData = createAsyncThunk(
  'getAllTaskData/fetchAllTaskData',
  async (projectId,pageNo,selectedFilters,currentRowPerPage,{ dispatch }) => {
    let queryString = `?project_id=${projectId}${pageNo ? "&page="+pageNo : ""}${currentRowPerPage ?"&records="+currentRowPerPage : ""}`;
     for (let key in selectedFilters) {
        if (selectedFilters[key] && selectedFilters[key] !== -1) {
          if(key=="task_status"){  
              queryString +=  `&${key}=${JSON.stringify(selectedFilters[key])}`
          }else{
            queryString +=  `&${key}=${selectedFilters[key]}`
          }
        }
      }
    const params = fetchParams(`${ENDPOINTS.getTasks+queryString}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getAllTaskData = createSlice({
  name: 'getAllTaskData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTaskData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTaskData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAllTaskData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getAllTaskData.reducer;
