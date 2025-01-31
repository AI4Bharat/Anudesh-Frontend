import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: 0,
};

const projectTabs = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = projectTabs.actions;

export default projectTabs.reducer;
