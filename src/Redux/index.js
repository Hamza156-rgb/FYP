import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import AuthReducer, { initialState as authInitialState } from '../Auth/AuthRedux';
import ChatReducer, { initialState as chatInitialState } from '../Chat/ChatRedux';

import BooksReducer, { initialState as bookInitialState } from '../Books/BooksRedux';
import contactReducer, { initialState as contactInitialState } from '../Contact/ContactRedux';

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const appReducer = combineReducers({
        auth: AuthReducer,
        books: BooksReducer,
        chat: ChatReducer,
        contact: contactReducer
    });

    const rootReducer = (state, action) => {

        /* Reset auth and chats when user logs out as they are for logged in user only */

        switch (action.type) {
            case 'USER_LOGOUT': {
                state = {
                    ...state,
                    auth: authInitialState,
                    chat: chatInitialState
                }
                break;
            }
        }

        return appReducer(state, action)
    }


    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

    // for removal of  chrome extension integration Use the below Code
    // return createStore(rootReducer, applyMiddleware(thunk));
}

