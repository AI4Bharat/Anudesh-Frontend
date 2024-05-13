import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const getWorkspaceUserReports = createSlice({
    name: "getWorkspaceUserReports",
    initialState,
    reducers: {
        setWorkspaceUserReports: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspaceUserReports } = getWorkspaceUserReports.actions;
export default getWorkspaceUserReports.reducer;
 