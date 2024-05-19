import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

const getTaskFilter = createSlice({
  name: 'getTaskFilter',
  initialState,
  reducers: {
    setTaskFilter : (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
  },
});

export const { setTaskFilter } = getTaskFilter.actions;
export default getTaskFilter.reducer;

