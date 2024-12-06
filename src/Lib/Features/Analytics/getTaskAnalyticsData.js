import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint";

const initialState = {
  data: [],
  originalData: [],
  status: 'idle',
  error: null,
};

const diffAnnotationReview = (payload) => {
  const respObjKeys = Object.keys(payload);
  const returnData = respObjKeys?.map((objName) => {
    return payload[objName]?.map(value => {
      return {
        projectType:(objName),
        languages: (value?.language),
        annotation_cumulative_tasks_count: (value?.ann_cumulative_tasks_count),
        review_cumulative_tasks_count: (value?.rew_cumulative_tasks_count),
        diff_annotation_review: (value?.ann_cumulative_tasks_count - value?.rew_cumulative_tasks_count)
      };
    })
  })
  return returnData;



};

export const fetchTaskAnalyticsData = createAsyncThunk(
  'getTaskAnalyticsData/fetchTaskAnalyticsData',
  async ({project_type_filter,progressObj}) => {
    let endpoint ;
    const body = progressObj
    project_type_filter=='AllTypes'?
    endpoint = `${ENDPOINTS.getOrganizations}public/1/cumulative_tasks_count/`
    :
    endpoint = `${ENDPOINTS.getOrganizations}public/1/cumulative_tasks_count/?project_type_filter=${project_type_filter}`
    const params = fetchParams(endpoint,"GET",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getTaskAnalyticsData = createSlice({
  name: 'getTaskAnalyticsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskAnalyticsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskAnalyticsData.fulfilled, (state, action) => {
        const data = diffAnnotationReview(action.payload);
        state.status = 'succeeded';
        state.data = data;
        state.originalData = action.payload;
      })
      .addCase(fetchTaskAnalyticsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getTaskAnalyticsData.reducer;
