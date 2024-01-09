import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const fetchLanguages = createSlice({
    name: "getProjectDomains",
    initialState,
    reducers: {
        setfetchLanguages: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setfetchLanguages } = fetchLanguages.actions;
export default fetchLanguages.reducer;
 