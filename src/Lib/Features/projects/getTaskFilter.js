import { accordionActionsClasses } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const getTaskFilter = createSlice({
  name: "getTaskFilter",
  initialState,
  reducers: {
    setTaskFilter: (state, action) => {
      state.status = "succeeded";
      const newItem = action.payload;

      const idMatches = state.data.filter((item) => item.id === newItem.id);

      if (idMatches.length === 0) {
        state.data = [newItem];
      } else {
        const index = state.data.findIndex(
          (item) => item.id === newItem.id && item.type === newItem.type,
        );

        if (index !== -1) {
          state.data[index] = newItem;
        } else {
          state.data.push(newItem);
        }
      }
    },
  },
});

export const { setTaskFilter } = getTaskFilter.actions;
export default getTaskFilter.reducer;
