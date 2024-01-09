import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const getUserAnalytics = createSlice({
    name: "getUserAnalytics",
    initialState,
    reducers: {
        setgetUserAnalytics: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setgetUserAnalytics } = getUserAnalytics.actions;
export default getUserAnalytics.reducer;
 