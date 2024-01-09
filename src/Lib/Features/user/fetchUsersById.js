import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const fetchUsersById = createSlice({
    name: "fetchUsersById",
    initialState,
    reducers: {
        setfetchUsersById: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setfetchUsersById } = fetchUsersById.actions;
export default fetchUsersById.reducer;
 