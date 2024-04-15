import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const  fetchTasksByProjectId = createAsyncThunk(
  'GetTasksByProjectId/fetchTasksByProjectId',
  async (payload) => {
    const { id, currentPageNumber, currentRowPerPage, selectedFilters, taskType, pullvalue,rejected,pull } = payload;
    console.log("yesin");
    let queryString = `?project_id=${id}${currentPageNumber ? "&page="+currentPageNumber : ""}${currentRowPerPage ?"&records="+currentRowPerPage : ""}`;
    let querystr = pull === "All" ?"": `&editable=${pullvalue}`
    let querystr1 = rejected === true ?`&rejected=`+"True":""
    for (let key in selectedFilters) {
     if (selectedFilters[key] && selectedFilters[key] !== -1) {
    switch (key) {
           case 'annotation_status':
         queryString +=`&${key}=["${selectedFilters[key]}"] ${querystr}${querystr1}`
             break;
             case 'review_status':
             queryString +=`&${key}=["${selectedFilters[key]}"] ${querystr} ${querystr1}`
                 break;
             case 'supercheck_status':
                  queryString +=`&${key}=["${selectedFilters[key]}"]`
                      break;
             default:
             queryString +=`&${key}=${selectedFilters[key]}`
         }
     }
    }



    const params = fetchParams(`${ENDPOINTS.getTasks+queryString}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetTasksByProjectId = createSlice({
  name: 'GetTasksByProjectId',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProjectId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByProjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTasksByProjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetTasksByProjectId.reducer;
