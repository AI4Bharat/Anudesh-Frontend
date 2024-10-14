import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../../fetchParams';
import ENDPOINTS from "../../../../config/apiendpoint";

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

export const fetchwsTaskAnalyticsData = createAsyncThunk(
  'getwsTaskAnalyticsData/fetchwsTaskAnalyticsData',
  async ({id,project_type_filter,progressObj}) => {
    let endpoint ;
    const body = progressObj
    project_type_filter=='AllTypes'?
    endpoint = `${ENDPOINTS.getWorkspaces}${id}/cumulative_tasks_count_all/`
    :
    endpoint = `${ENDPOINTS.getWorkspaces}${id}/cumulative_tasks_count_all/?project_type_filter=${project_type_filter}`
    const params = fetchParams(endpoint,"GET",JSON.stringify(body));
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getwsTaskAnalyticsData = createSlice({
  name: 'getwsTaskAnalyticsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchwsTaskAnalyticsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchwsTaskAnalyticsData.fulfilled, (state, action) => {
        const data = diffAnnotationReview(action.payload);
        state.status = 'succeeded';
        state.data = data;
        state.originalData = action.payload
      })
      .addCase(fetchwsTaskAnalyticsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getwsTaskAnalyticsData.reducer;
