import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchParams from '../fetchParams';

const initialState = {
    status: 'idle',
    error: null,
    data: null,
};

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (id) => {
    const params = fetchParams(`/users/account/${id}/fetch/`, "GET");
    return fetch(params.url, params.options)
        .then(response => response.json())
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(fetchUserData.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.data = action.payload
          })
          .addCase(fetchUserData.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchUserData.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      }
});

export default userSlice.reducer;