import { LOAD_REPOS_ERROR, LOAD_REPOS_LOADING, LOAD_REPOS_SUCCESS } from "./ReposAction";

const initialState = {
    allRepos: [],
    loading: false,
    error: ''
};

export default function reducer(state = initialState, action) {
    
    switch (action.type) {
        case LOAD_REPOS_LOADING: {
            return {
                ...state,
                loading: true,
                error: ''
            };
        }
        case LOAD_REPOS_SUCCESS: {
            return {
                ...state,
                allRepos: action.payload,
                loading: false
            }
        }
        case LOAD_REPOS_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        }
        default: {
            return state;
        }
    }
}