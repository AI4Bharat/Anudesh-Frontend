import { createSlice } from '@reduxjs/toolkit'

import constants from "../../app/actions/constants";

let initialState = {
    data:[]
}


const RemoveWorkspaceMember = createSlice({
    name: "RemoveWorkspaceMember",
    initialState,
    reducers: {
        setRemoveWorkspaceMember: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setRemoveWorkspaceMember } = RemoveWorkspaceMember.actions;
export default RemoveWorkspaceMember.reducer;
 