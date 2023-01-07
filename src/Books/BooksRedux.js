import {
    RESET_FOR_ADD_NEW_BOOK,
    LOAD_GET_BOOK_ERROR, LOAD_GET_BOOK_LOADING, LOAD_GET_BOOK_SUCCESS,
    LOAD_FEATURED_BOOK_LOADING, LOAD_FEATURED_BOOK_SUCCESS, LOAD_FEATURED_BOOK_ERROR,
    LOAD_USER_BOOK_ERROR, LOAD_USER_BOOK_LOADING, LOAD_USER_BOOK_SUCCESS,
    LOAD_BOOK_LOADING, LOAD_BOOK_ERROR, LOAD_BOOK_SUCCESS,
    LOAD_ADD_BOOK_LOADING, LOAD_ADD_BOOK_SUCCESS, LOAD_ADD_BOOK_ERROR,
    LOAD_DELETE_BOOK_LOADING, LOAD_DELETE_BOOK_SUCCESS, LOAD_DELETE_BOOK_ERROR
} from "./BooksAction";

export const initialState = {
    loading: true,
    success: '',
    error: '',
    delete_loading: false,
    user_books_loading: false,

    // new added book / update book id
    book: null,
    book_loading: false,
    book_error: '',
    book_success: '',

    add_loading: false,
    add_error: '',
    add_success: '',

    userBooks: [],
    allBooks: [],
    featuredBooks: [],
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        // RESET_FOR_ADD_NEW_BOOK
        case RESET_FOR_ADD_NEW_BOOK: {
            console.log(RESET_FOR_ADD_NEW_BOOK);
            return {
                ...state,
                book: null,
                book_loading: false,
                book_error: '',
                book_success: '',

                add_loading: false,
                add_error: '',
                add_success: '',
            }
        }

        //LOAD_BOOK_LOADING, LOAD_BOOK_ERROR, LOAD_BOOK_SUCCESS,
        case LOAD_BOOK_LOADING: {
            console.log(LOAD_BOOK_LOADING);
            return {
                ...state,
                loading: true,
                success: '',
                error: ''
            };
        }
        case LOAD_BOOK_SUCCESS: {
            console.log(LOAD_BOOK_SUCCESS);
            return {
                ...state,
                ...action.payload,
                loading: false
            }
        }
        case LOAD_BOOK_ERROR: {
            console.log(LOAD_BOOK_ERROR);
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        }

        // LOAD_FEATURED_BOOK_LOADING, LOAD_FEATURED_BOOK_SUCCESS, LOAD_FEATURED_BOOK_ERROR,
        case LOAD_FEATURED_BOOK_LOADING: {
            console.log(LOAD_FEATURED_BOOK_LOADING);
            return {
                ...state,
                loading: true,
                success: '',
                error: ''
            };
        }
        case LOAD_FEATURED_BOOK_SUCCESS: {
            console.log(LOAD_FEATURED_BOOK_SUCCESS);
            return {
                ...state,
                ...action.payload,
                loading: false
            }
        }
        case LOAD_FEATURED_BOOK_ERROR: {
            console.log(LOAD_FEATURED_BOOK_ERROR);
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        }

        //LOAD_USER_BOOK_ERROR, LOAD_USER_BOOK_LOADING, LOAD_USER_BOOK_SUCCESS,
        case LOAD_USER_BOOK_LOADING: {
            console.log(LOAD_USER_BOOK_LOADING);

            return {
                ...state,
                user_books_loading: true,
                success: '',
                error: ''
            };
        }
        case LOAD_USER_BOOK_SUCCESS: {
            console.log(LOAD_USER_BOOK_SUCCESS);

            return {
                ...state,
                ...action.payload,
                user_books_loading: false
            }
        }
        case LOAD_USER_BOOK_ERROR: {
            console.log(LOAD_USER_BOOK_ERROR);

            return {
                ...state,
                user_books_loading: false,
                error: action.payload.error
            };
        }

        // LOAD_GET_BOOK_ERROR, LOAD_GET_BOOK_LOADING, LOAD_GET_BOOK_SUCCESS,
        case LOAD_GET_BOOK_LOADING: {
            console.log(LOAD_GET_BOOK_LOADING);

            return {
                ...state,
                book: null,
                book_loading: true,
                book_error: '',
                book_success: '',
            };
        }
        case LOAD_GET_BOOK_SUCCESS: {
            console.log(LOAD_GET_BOOK_SUCCESS);

            return {
                ...state,
                ...action.payload, // book to add/edit
                book_loading: false,
                book_error: '',
            }
        }
        case LOAD_GET_BOOK_ERROR: {
            console.log(LOAD_GET_BOOK_ERROR);

            return {
                ...state,
                book_loading: false,
                book_success: '',
                book_error: action.payload.error
            };
        }

        // LOAD_ADD_BOOK_LOADING, LOAD_ADD_BOOK_SUCCESS, LOAD_ADD_BOOK_ERROR,
        case LOAD_ADD_BOOK_LOADING: {
            console.log(LOAD_ADD_BOOK_LOADING);

            return {
                ...state,
                add_loading: true,
                add_success: '',
                add_error: ''
            };
        }
        case LOAD_ADD_BOOK_SUCCESS: {
            console.log(LOAD_ADD_BOOK_SUCCESS);

            let allBooks = [...state.allBooks, action.payload.book]

            return {
                ...state,
                add_error: '',
                book: action.payload.book, // book to add/edit
                add_success: action.payload.add_success || 'Book Added Successfuly',
                allBooks,
                add_loading: false,
            }
        }
        case LOAD_ADD_BOOK_ERROR: {
            console.log(LOAD_ADD_BOOK_ERROR);

            return {
                ...state,
                add_loading: false,
                add_success: '',
                add_error: action.payload.error
            };
        }


        //LOAD_DELETE_BOOK_LOADING, LOAD_DELETE_BOOK_SUCCESS, LOAD_DELETE_BOOK_ERROR
        case LOAD_DELETE_BOOK_LOADING: {
            console.log(LOAD_DELETE_BOOK_LOADING);

            return {
                ...state,
                delete_loading: true,
                error: '',
                success: ''
            };
        }
        case LOAD_DELETE_BOOK_SUCCESS: {
            console.log(LOAD_DELETE_BOOK_SUCCESS);

            /* Remove Book from all colections */
            let book = action.payload.book;

            let books = state.allBooks;
            let index_allBooks = books.indexOf(book);
            if (index_allBooks > -1) {
                books.splice(index_allBooks, 1);
            }

            let user_books = state.userBooks;
            let index_userBooks = user_books.indexOf(book);
            if (index_userBooks > -1) {
                user_books.splice(index_userBooks, 1);
            }

            let featuredBooks = state.featuredBooks;
            let index_featuredBooks = featuredBooks.indexOf(book);
            if (index_featuredBooks > -1) {
                featuredBooks.splice(index_featuredBooks, 1);
            }

            /* state re-assign */
            return {
                ...state,
                allBooks: [...books],
                userBooks: [...user_books],
                featuredBooks: [...featuredBooks],
                success: 'Book deleted successfully',
                delete_loading: false,
                error: ''
            }

        }
        case LOAD_DELETE_BOOK_ERROR: {
            console.log(LOAD_DELETE_BOOK_ERROR);

            return {
                ...state,
                delete_loading: false,
                success: '',
                error: action.payload.error
            };
        }
        default: {
            return state;
        }
    }
}