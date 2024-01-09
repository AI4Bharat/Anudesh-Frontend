import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const getWorkspaceProjectData = createSlice({
    name: "getWorkspacesProjectData",
    initialState,
    reducers: {
        setWorkspaceProjectData: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspaceProjectData } = getWorkspaceProjectData.actions;
export default getWorkspaceProjectData.reducer;
 