import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: "",
};

const getGlossarySentence = createSlice({
  name: 'getGlossarySentence',
  initialState,
  reducers: {
    setGlossarySentence: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setGlossarySentence } = getGlossarySentence.actions;
export default getGlossarySentence.reducer;