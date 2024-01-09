import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const getWorkspacesAnnotatorsData = createSlice({
    name: "getWorkspacesAnnotatorsData",
    initialState,
    reducers: {
        setWorkspacesAnnotatorsData: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspacesAnnotatorsData } = getWorkspacesAnnotatorsData.actions;
export default getWorkspacesAnnotatorsData.reducer;
 