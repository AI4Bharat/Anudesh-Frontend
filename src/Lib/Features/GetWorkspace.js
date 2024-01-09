import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}

const getWorkspace= createSlice({
    name: "getWorkspace",
    initialState,
    reducers: {
        setWorkspace: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setWorkspace } = getWorkspace.actions;
export default getWorkspace.reducer;
 