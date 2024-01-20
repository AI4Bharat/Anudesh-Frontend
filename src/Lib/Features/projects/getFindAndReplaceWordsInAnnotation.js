import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchParams from '../../fetchParams';
import ENDPOINTS from "../../../config/apiendpoint"
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchFindAndReplaceWordsInAnnotation = createAsyncThunk(
  'getFindAndReplaceWordsInAnnotation/fetchFindAndReplaceWordsInAnnotation',
  async (projectId,AnnotationObj, { dispatch }) => {
    const params = fetchParams(`${ENDPOINTS.getTasks}${projectId}/find_and_replace_words_in_annotation/`,"POST",AnnotationObj);
    return fetch(params.url, params.options)
        .then(response => response.json())
  }
);

const getFindAndReplaceWordsInAnnotation = createSlice({
  name: 'getFindAndReplaceWordsInAnnotation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFindAndReplaceWordsInAnnotation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFindAndReplaceWordsInAnnotation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFindAndReplaceWordsInAnnotation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getFindAndReplaceWordsInAnnotation.reducer;
