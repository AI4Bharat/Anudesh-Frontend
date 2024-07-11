import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
  data: [],
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
        annotation_cumulative_word_count: (value?.ann_cumulative_word_count),
        review_cumulative_word_count: (value?.rew_cumulative_word_count),
        diff_annotation_review: (value?.ann_cumulative_word_count - value?.rew_cumulative_word_count),

        annotation_cumulative_sentance_count: (value?.total_ann_sentance_count),
        review_cumulative_sentance_count: (value?.total_rev_sentance_count),
        diff_annotation_review_sentance_count: (value?.total_ann_sentance_count - value?.total_rev_sentance_count),

        annotation_audio_word_count: (value?.ann_audio_word_count),
        review_audio_word_count: (value?.rev_audio_word_count),
        diff_annotation_review_audio_word: (value?.ann_audio_word_count - value?.rev_audio_word_count),

        ann_ocr_cumulative_word_count: (value?.ann_ocr_cumulative_word_count),
        rew_ocr_cumulative_word_count: (value?.rew_ocr_cumulative_word_count),
        diff_annotation_review_ocr_word: (value?.ann_ocr_cumulative_word_count - value?.rew_ocr_cumulative_word_count),

        annotation_raw_aud_duration:(value?.ann_raw_aud_duration),
        review_raw_aud_duration:(value?.rew_raw_aud_duration),
        annotation_raw_aud_duration_tohour:(value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        review_raw_aud_duration_tohour:(value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        diff_annotation_review_raw_aud_duration_tohour:(value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600 - value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_raw_aud_duration?.split(':')?.map(Number)?.[2]/3600),

        annotation_aud_duration:(value?.ann_cumulative_aud_duration),
        review_aud_duration:(value?.rew_cumulative_aud_duration),
        annotation_aud_duration_tohour:(value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        review_aud_duration_tohour:(value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600),
        diff_annotation_review_aud_duration_tohour:(value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.ann_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600 - value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[0] * 1 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[1]/ 60 + value?.rew_cumulative_aud_duration?.split(':')?.map(Number)?.[2]/3600)
      };
    })
    
  })
  return returnData;
};

export const fetchMetaAnalyticsData = createAsyncThunk(
  'getMetaAnalyticsData/fetchMetaAnalyticsData',
  async ({OrgId,project_type_filter,progressObj}) => {
    let endpoint ;
    const body = progressObj
    project_type_filter=='AllTypes'?
    endpoint = `${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true`
    :
    endpoint = `${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true&project_type_filter=${project_type_filter}`
    const params = fetchParams(endpoint);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);
const getMetaAnalyticsData = createSlice({
  name: 'getMetaAnalyticsData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetaAnalyticsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMetaAnalyticsData.fulfilled, (state, action) => {
        const data = diffAnnotationReview(action.payload);
        state.status = 'succeeded';
        state.data = data;
      })
      .addCase(fetchMetaAnalyticsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default getMetaAnalyticsData.reducer;