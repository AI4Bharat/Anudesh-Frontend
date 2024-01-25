import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDataitemsById = createAsyncThunk(
  'GetDataitemsById/fetchDataitemsById',
  async (instanceIds, datasetType,selectedFilters,pageNo, countPerPage, { dispatch }) => {
    const body ={
        instance_ids: instanceIds,
        dataset_type: datasetType,
        search_keys:selectedFilters
      }
    const queryString = `?${pageNo ? "&page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}`

    const params = fetchParams(`${ENDPOINTS.getDatasets}dataitems/get_data_items/${queryString}`,"POST",body);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDataitemsById = createSlice({
  name: 'GetDataitemsById',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataitemsById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDataitemsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDataitemsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDataitemsById.reducer;
