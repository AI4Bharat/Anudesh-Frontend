import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const getLoggedInUserData = createSlice({
    name: "getLoggedInUserData",
    initialState,
    reducers: {
        setLoggedInUserData: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setLoggedInUserData } = getLoggedInUserData.actions;
export default getLoggedInUserData.reducer;
 