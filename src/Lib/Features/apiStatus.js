import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    data:[]
}


const apistatus = createSlice({
    name: "apistatus",
    initialState,
    reducers: {
        setapistatus: (state=0, action) => {
            state.data = action.payload;
        }
    }
});


export const { setapistatus } = apistatus.actions;
export default apistatus.reducer;
 