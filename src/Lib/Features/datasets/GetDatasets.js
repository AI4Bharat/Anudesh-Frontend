import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchDatasets = createAsyncThunk(
  'GetDatasets/fetchDatasets',
  async (selectedFilters, { dispatch }) => {
    let queryString = "";

    for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== "") {
        switch (key) {
          case 'dataset_visibility':
            queryString += `${key}=${selectedFilters[key]}`
            break;
          case 'dataset_type':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
         
          default:
            queryString += ``

        }
      }
    }
    const params = fetchParams(`${ENDPOINTS.getDatasets}instances/?${queryString}`);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const GetDatasets = createSlice({
  name: 'GetDatasets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default GetDatasets.reducer;
