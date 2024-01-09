import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const getProjectDomains = createSlice({
    name: "getProjectDomains",
    initialState,
    reducers: {
        setProjectDomains: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setProjectDomains } = getProjectDomains.actions;
export default getProjectDomains.reducer;
 