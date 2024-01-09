import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const getWorkspaceManagersData = createSlice({
    name: "getWorkspaceManagersData",
    initialState,
    reducers: {
        setWorkspaceManagersData: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspaceManagersData } = getWorkspaceManagersData.actions;
export default getWorkspaceManagersData.reducer;
 