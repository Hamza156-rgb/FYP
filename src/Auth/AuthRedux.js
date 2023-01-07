import {
    LOAD_AUTH_LOADING, LOAD_AUTH_ERROR, LOAD_AUTH_SUCCESS,
    LOAD_USER_UPDATE_LOADING, LOAD_USER_UPDATE_ERROR, LOAD_USER_UPDATE_SUCCESS,
    LOAD_AUTH_ACTION_LOADING, LOAD_AUTH_ACTION_ERROR, LOAD_AUTH_ACTION_SUCCESS
} from "./AuthAction";

export const initialState = {
    loading: false,
    newMessage: false,
    update_loading: false,
    error: '',
    success: '',
    user: null,
    token: null,
    authenticated: false,

    auth_loading: false,
    auth_error: ''
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        //login, sign up, social logins
        case LOAD_AUTH_ACTION_LOADING: {
            console.log(LOAD_AUTH_ACTION_LOADING);
            return {
                ...state,
                auth_loading: true,
                authenticated: false,
                auth_error: ''
            };
        }
        case LOAD_AUTH_ACTION_SUCCESS: {
            console.log(LOAD_AUTH_ACTION_SUCCESS);
            return {
                ...state,
                ...action.payload,
                auth_loading: false
            }
        }
        case LOAD_AUTH_ACTION_ERROR: {
            console.log(LOAD_AUTH_ACTION_ERROR);
            return {
                ...state,
                user: null,
                token: null,
                authenticated: false,
                auth_loading: false,
                auth_error: action.payload.error
            };
        }

        //  authenticate logged in user
        case LOAD_AUTH_LOADING: {
            return {
                ...state,
                loading: true,
                authenticated: false,
                error: ''
            };
        }
        case LOAD_AUTH_SUCCESS: {
            return {
                ...state,
                ...action.payload,
                loading: false
            }
        }
        case LOAD_AUTH_ERROR: {
            return {
                ...state,
                loading: false,
                user: null,
                token: null,
                authenticated: false,
                error: action.payload.error
            };
        }

        //  Update logged in user
        case LOAD_USER_UPDATE_LOADING: {
            return {
                ...state,
                update_loading: true,
                error: '',
                success: '',
            };
        }
        case LOAD_USER_UPDATE_SUCCESS: {
            return {
                ...state,
                ...action.payload, // update user object
                update_loading: false
            }
        }
        case LOAD_USER_UPDATE_ERROR: {
            return {
                ...state,
                update_loading: false,
                success: '',
                error: action.payload.error,
            };
        }

        default: {
            return state;
        }
    }
}