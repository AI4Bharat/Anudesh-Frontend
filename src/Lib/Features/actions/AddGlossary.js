import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: "",
};

const getDomain = createSlice({
  name: 'getDomain',
  initialState,
  reducers: {
    setDomain: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setDomain } = getDomain.actions;
export default getDomain.reducer;