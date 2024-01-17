import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const getRecentTasks = createSlice({
    name: "getRecentTasks",
    initialState,
    reducers: {
        setRecentTasks: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setRecentTasks } = getRecentTasks.actions;
export default getRecentTasks.reducer;
 