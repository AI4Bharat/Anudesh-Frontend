import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiendpoint from '@/config/apiendpoint';
import fetchParams from '@/Lib/fetchParams';

// Desc: Reducer for getting manager suggestions
let initialState = {
    data: [],
    status: 'idle',
    error: null,
}

export const fetchManagerSuggestions = createAsyncThunk(
    'getManagerSuggestions/fetchManagerSuggestions',
    async (props) => {
        const params = fetchParams(`${apiendpoint.inviteUsers}pending_users/?organisation_id=${props.orgId}`);
        return fetch(params.url, params.options)
            .then(response => response.json())
    }
);
const getManagerSuggestions = createSlice({
    name: 'getManagerSuggestions',
    initialState,
    reducers: {
        getManagerSuggestionsPending: (state) => {
            state.status = 'loading';
        },
        getManagerSuggestionsSuccess: (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
        },
        getManagerSuggestionsFailed: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    },
});

export default getManagerSuggestions.reducer;
// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         case constants.GET_MANAGER_SUGGESTIONS:
//             return {
//                 ...state,
//                 data: action.payload
//             } 

//         default:
//             return {
//                 ...state
//             }
//     }
// };

// export default reducer;