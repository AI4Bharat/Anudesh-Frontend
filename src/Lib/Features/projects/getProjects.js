import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'getProjects/fetchProjects',
  async ({ selectedFilters, guestworkspace }) => {
    let queryString = "";

    for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== "") {
        switch (key) {
          case 'project_type':
            queryString += `${key}=${selectedFilters[key]}`
            break;
          case 'project_user_type':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
          case 'archived_projects':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
          default:
            queryString += ``

        }
      }
    }
    if (guestworkspace == true) {
      queryString += `${queryString ? '&' : ''}guest_view=true`;
    }
    const params = fetchParams(`${ENDPOINTS.getProjects}projects_list/optimized/?${queryString}`);
    return fetch(params.url, params.options)
      .then(response => response.json())
  }
);

const getProjects = createSlice({
  name: 'getProjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getProjects.reducer;
