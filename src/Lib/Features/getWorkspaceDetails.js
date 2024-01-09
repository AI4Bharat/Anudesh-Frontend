import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const getWorkspaceDetails = createSlice({
    name: "getWorkspaceDetails",
    initialState,
    reducers: {
        setWorkspaceDetails: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspaceDetails } = getWorkspaceDetails.actions;
export default getWorkspaceDetails.reducer;
 