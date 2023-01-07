import {
    LOAD_CHANNEL_LOADING, LOAD_CHANNEL_ERROR, LOAD_CHANNEL_SUCCESS,
    LOAD_ADD_CHANNEL_LOADING, LOAD_ADD_CHANNEL_SUCCESS, LOAD_ADD_CHANNEL_ERROR,
} from "./ChatAction";

export const initialState = {
    loading: false,
    success: '',
    error: '',
    
    channels: null,
    channel: null,

    add_loading: false,
    add_success: '',
    add_error: '',
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case LOAD_CHANNEL_LOADING: {
            console.log(LOAD_CHANNEL_LOADING);

            return {
                ...state,
                loading: true,
                success: 'Channels Fetched!',
                error: ''
            };
        }
        case LOAD_CHANNEL_SUCCESS: {
            console.log(LOAD_CHANNEL_SUCCESS);

            return {
                ...state,
                ...action.payload,
                loading: false,
                error: ''
            }
        }
        case LOAD_CHANNEL_ERROR: {
            console.log(LOAD_CHANNEL_ERROR);

            return {
                ...state,
                loading: false,
                success: '',
                error: action.payload.error
            };
        }

        // LOAD_ADD_CHANNEL_LOADING, LOAD_ADD_CHANNEL_SUCCESS, LOAD_ADD_CHANNEL_ERROR,
        case LOAD_ADD_CHANNEL_LOADING: {
            console.log(LOAD_CHANNEL_LOADING);

            return {
                ...state,
                add_loading: true,
                add_success: '',
                add_error: ''
            };
        }
        case LOAD_ADD_CHANNEL_SUCCESS: {
            console.log(LOAD_CHANNEL_SUCCESS);

            return {
                ...state,
                ...action.payload,
                add_error: '',
                add_success: 'Channel Added Successfuly',
                add_loading: false
            }
        }
        case LOAD_ADD_CHANNEL_ERROR: {
            console.log(LOAD_CHANNEL_ERROR);

            return {
                ...state,
                add_loading: false,
                add_success: '',
                add_error: action.payload.error
            };
        }

        default: {
            return state;
        }
    }
}