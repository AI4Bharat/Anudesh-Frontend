import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash"; // Make sure to import lodash for deep comparison

const initialState = {
  data: [],
  status: "idle",
  error: null,
  currentFilterId: null,
};

const taskPaginationSlice = createSlice({
  name: "taskPaginationSlice",
  initialState,
  reducers: {
    setPageFilter: (state, action) => {
      state.status = "succeeded";
      const newFilter = action.payload;
      state.currentFilterId = newFilter.id;

      // Check if we have any filters for this ID
      const existingFiltersForId = state.data.filter(item => item.id === newFilter.id);
      
      if (existingFiltersForId.length === 0) {
        // New ID - reset with this filter (page 1) at position 0
        state.data = [{
          ...newFilter,
          page: 1
        }];
        return;
      }

      // Check for filter with matching criteria
      const matchingFilterIndex = state.data.findIndex(item => 
        item.id === newFilter.id &&
        item.type === newFilter.type &&
        _.isEqual(item.selectedFilters, newFilter.selectedFilters) &&
        item.pull === newFilter.pull &&
        item.rejected === newFilter.rejected
      );

      let updatedData = [...state.data];
      
      if (matchingFilterIndex !== -1) {
        // Update existing filter
        updatedData[matchingFilterIndex] = {
          ...updatedData[matchingFilterIndex],
          ...newFilter
        };
        
        // If it's not already at position 0, move it there
        if (matchingFilterIndex !== 0) {
          const [movedItem] = updatedData.splice(matchingFilterIndex, 1);
          updatedData.unshift(movedItem);
        }
      } else {
        // New filter combination - add at position 0 with page 1
        updatedData.unshift({
          ...newFilter,
          page: 1
        });
        
        // Keep only the most recent filters for this ID (optional)
        // You might want to limit how many filters are stored per ID
        updatedData = updatedData.filter((item, index) => 
          item.id !== newFilter.id || index === 0 || index < 10
        );
      }

      state.data = updatedData;
    },
    // Add other reducers as needed
  }
});

export const { setPageFilter } = taskPaginationSlice.actions;
export default taskPaginationSlice.reducer;