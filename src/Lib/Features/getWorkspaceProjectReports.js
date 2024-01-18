import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const getWorkspaceProjectReports = createSlice({
    name: "getWorkspaceProjectReports",
    initialState,
    reducers: {
        setWorkspaceProjectReports: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspaceProjectReports } = getWorkspaceProjectReports.actions;
export default getWorkspaceProjectReports.reducer;
 