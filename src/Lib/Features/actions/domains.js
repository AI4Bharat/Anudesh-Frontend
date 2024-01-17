import fetchParams from '@/Lib/fetchParams';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    error: null,
    domains: [],
};

export const fetchDomains = createAsyncThunk('domains/fetchDomains', async () => {
    const params = fetchParams("/projects/types");
    return fetch(params.url, params.options)
        .then(response => response.json())
});

const domainsSlice = createSlice({
    name: 'domains',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(fetchDomains.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.domains = action.payload
          })
          .addCase(fetchDomains.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchDomains.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      }
});

export default domainsSlice.reducer;