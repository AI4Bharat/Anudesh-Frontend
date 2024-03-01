import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: "",
};

const getTaskDetails = createSlice({
  name: 'getTaskDetails',
  initialState,
  reducers: {
    setTaskDetails: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setTaskDetails } = getTaskDetails.actions;
export default getTaskDetails.reducer;
