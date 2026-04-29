import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ENDPOINTS from "../../../config/apiendpoint"

const initialState = {
    status: 'idle',
    error: null,
    data: null,
};

export const fetchDomain = createAsyncThunk('getDomain/fetchDomain', async (glossaryObj) => {
  const url = `${"https://glossary-api.ai4bharat.org/glossary-explorer"}${ENDPOINTS.Glossary}domain`;
  const token = window.localStorage.getItem('anudesh_access_token');
  
  if (!token) {
      throw new Error('No access token found');
  }

  const options = {
      method: 'GET',
      body:JSON.stringify(glossaryObj),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
      },
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.json();
  } catch (error) {
      throw new Error('Error fetching data: ' + error.message);
  }
});


const getDomain = createSlice({
    name: 'getDomain',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(fetchDomain.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.data = action.payload
          })
          .addCase(fetchDomain.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchDomain.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      }
});
export default getDomain.reducer;
