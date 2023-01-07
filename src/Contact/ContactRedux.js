import {
    LOAD_CONTACT_SUCCESS, LOAD_CONTACT_ERROR, LOAD_CONTACT_LOADING,
} from "./ContactAction";

export const initialState = {
    loading: false,
    success: '',
    error: '',
};

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case LOAD_CONTACT_LOADING: {
            console.log(LOAD_CONTACT_LOADING);

            return {
                ...state,
                loading: true,
                success: '',
                error: ''
            };
        }
        case LOAD_CONTACT_SUCCESS: {
            console.log(LOAD_CONTACT_SUCCESS);

            return {
                ...state,
                ...action.payload,
                success: 'Message Sent!',
                loading: false
            }
        }
        case LOAD_CONTACT_ERROR: {
            console.log(LOAD_CONTACT_ERROR);

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