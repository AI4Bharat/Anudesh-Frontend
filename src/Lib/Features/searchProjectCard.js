import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue: "",
};

const searchProjectCard = createSlice({
  name: 'searchProjectCard',
  initialState,
  reducers: {
    setSearchProjectCard: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setSearchProjectCard } = searchProjectCard.actions;
export default searchProjectCard.reducer;
