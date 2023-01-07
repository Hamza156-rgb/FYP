import { auth, db, storage, firebaseErrors } from "../Services/Firebase";
import Helper from "../Services/Helper";

import {
    collection, query, where, getDocs, getDoc,
    doc, setDoc, Timestamp,
    deleteDoc,
    updateDoc,
    orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import _ from "lodash";

export const RESET_FOR_ADD_NEW_BOOK = "'REDUX_THUNK_RESET_FOR_ADD_NEW_BOOK";

export const LOAD_BOOK_LOADING = 'REDUX_THUNK_LOAD_BOOK_LOADING';
export const LOAD_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_BOOK_SUCCESS';
export const LOAD_BOOK_ERROR = 'REDUX_THUNK_LOAD_BOOK_ERROR';

export const LOAD_FEATURED_BOOK_LOADING = 'REDUX_THUNK_LOAD_FEATURED_BOOK_LOADING';
export const LOAD_FEATURED_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_FEATURED_BOOK_SUCCESS';
export const LOAD_FEATURED_BOOK_ERROR = 'REDUX_THUNK_LOAD_FEATURED_BOOK_ERROR';

export const LOAD_USER_BOOK_LOADING = 'REDUX_THUNK_LOAD_USER_BOOK_LOADING';
export const LOAD_USER_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_USER_BOOK_SUCCESS';
export const LOAD_USER_BOOK_ERROR = 'REDUX_THUNK_LOAD_USER_BOOK_ERROR';

export const LOAD_GET_BOOK_LOADING = 'REDUX_THUNK_LOAD_GET_BOOK_LOADING';
export const LOAD_GET_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_GET_BOOK_SUCCESS';
export const LOAD_GET_BOOK_ERROR = 'REDUX_THUNK_LOAD_GET_BOOK_ERROR';

export const LOAD_ADD_BOOK_LOADING = 'REDUX_THUNK_LOAD_ADD_BOOK_LOADING';
export const LOAD_ADD_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_ADD_BOOK_SUCCESS';
export const LOAD_ADD_BOOK_ERROR = 'REDUX_THUNK_LOAD_ADD_BOOK_ERROR';


export const LOAD_DELETE_BOOK_LOADING = 'REDUX_THUNK_LOAD_DELETE_BOOK_LOADING';
export const LOAD_DELETE_BOOK_SUCCESS = 'REDUX_THUNK_LOAD_DELETE_BOOK_SUCCESS';
export const LOAD_DELETE_BOOK_ERROR = 'REDUX_THUNK_LOAD_DELETE_BOOK_ERROR';

const booksRef = collection(db, "books");

const getFeaturedBooks = () => async (dispatch) => {
    dispatch(featured_request());
    const q = query(booksRef, where("featured", "==", true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) {
        const featuredBooks = querySnapshot.docs.map((doc) => {
            return doc.data();
        });

        return dispatch(featured_success({ featuredBooks }))
    } else {
        return dispatch(featured_failure({ message: 'Nothing featured yet!' }))
    }
};

const getUserBooks = ({ userId }) => async (dispatch) => {
    
    dispatch(user_books_request());

    if (userId) {

        // need indexing for this
        const queryOrder = orderBy("postedAt", "desc");

        const q = query(booksRef, where(`owner.uid`, "==", userId), queryOrder);

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs) {
            const books = querySnapshot.docs.map((doc) => {
                return doc.data();
            });

            return dispatch(user_books_success({ userBooks: books }))
        } else {
            return dispatch(user_books_failure({ message: 'Books Not Found' }))
        }

    } else {
        return dispatch(user_books_failure({ message: 'Books Not Found' }))
    }
};


const getBooksBySearch = ({ category, language, keyword }) => async (dispatch) => {
    dispatch(request());

    let queries = [];

    if (keyword) {
        queries.push(where(
            "searchTerms",
            "array-contains",
            keyword.toLowerCase()
        ));
    }

    if (category) {
        queries.push(where(
            "category", "==", category.toLowerCase()
        ));
    }

    if (language) {
        queries.push(where(
            "language", "==", language.toLowerCase()
        ));
    }

    // need indexing for this
    const queryOrder = orderBy("postedAt", "desc");

    const q = queries && queries.length !== 0
        ? query(booksRef, ...queries, queryOrder)
        : query(booksRef, queryOrder);

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) {
        const allBooks = querySnapshot.docs.map((doc) => {
            return doc.data();
        });

        return dispatch(success({ allBooks }))
    } else {
        return dispatch(failure({ message: 'Books Not Found' }))
    }
};

const addBook = (data) => async (dispatch) => {
    dispatch(add_request());

    const {
        id,
        image,
        book_image,
        bookName,
        price,
        condition,
        phone,
        address,
        category,
        description,
        language,
    } = data;

    const currentUser = auth.currentUser;

    // assign owner info
    let owner = {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL
    };

    let nameString = bookName.toLowerCase();
    let searchArray = nameString.split(" ");
    searchArray.push(category);
    searchArray.push(condition);
    searchArray.push(language);

    // get unique list of terms
    searchArray = _.without(_.uniq(searchArray), undefined, "", null);

    // add book and upload image;

    const imageId = Helper.simpleUniqueId('image-');

    const storageRef = ref(storage, 'images/' + imageId); //image.name
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg',
    };

    /** image is must for new */
    if (image) {

        uploadBytes(storageRef, image, metadata).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);

                // create a unique id for book
                const newId = id || Helper.simpleUniqueId('book-');

                let docData = {
                    postedAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date()),
                    bookName,
                    image: downloadURL,
                    price,
                    condition,
                    phone,
                    address,
                    category,
                    description,
                    searchTerms: searchArray,
                    language,

                    // Assign owner information and unique id for book
                    owner,
                    ownerId: owner.uid,
                    id: newId
                };

                if (id) {

                    docData.updatedAt = Timestamp.fromDate(new Date());

                    updateDoc(doc(db, "books", id), docData)
                        .then((result) => {
                            console.log(result);

                            return dispatch(add_success({ book: docData, add_success: 'Book updated Successfully!' }))
                        })
                        .catch((error) => {
                            console.log(error);
                            return dispatch(add_failure(error))
                        })

                } else {

                    docData.postedAt = Timestamp.fromDate(new Date());

                    setDoc(doc(db, "books", newId), docData)
                        .then((result) => {
                            console.log(result);

                            return dispatch(add_success({ book: docData, add_success: 'Book added Successfully!' }))
                        })
                        .catch((error) => {
                            console.log(error);
                            return dispatch(add_failure(error))
                        })
                }


            }).catch((error) => {
                console.log(error);
                return dispatch(add_failure(error))
            })

        });
    } else if (id) {

        const newId = id || Helper.simpleUniqueId('book-');

        // skip image upload if id andno image file
        const docData = {
            updatedAt: Timestamp.fromDate(new Date()),
            bookName,
            price,
            condition,
            phone,
            address,
            category,
            description,
            searchTerms: searchArray,
            language,

            // Assign owner information and unique id for book
            owner,
            ownerId: owner.uid,
            id: newId
        };

        updateDoc(doc(db, "books", id), docData)
            .then((result) => {
                console.log(result);

                return dispatch(add_success({ book: docData, add_success: 'Book updated Successfully!' }))
            })
            .catch((error) => {
                console.log(error);
                return dispatch(add_failure(error))
            })

    }


    // Upload the file and metadata


};

const deleteBook = (book) => async (dispatch) => {
    dispatch(delete_request());

    console.log("deleting This book", book);
    const currentUser = auth.currentUser;
    // check if user is the owner
    if (currentUser.uid === book.owner.uid) {
        await deleteDoc(doc(db, "books", book.id))
            .then((result) => {
                console.log(result);
                return dispatch(delete_success({ book }))
            })
            .catch((error) =>
                dispatch(delete_failure(error))
            )
    } else {
        dispatch(delete_failure("not Authorized"))
    }

};

const getBookById = (book_id) => async (dispatch) => {
    dispatch(get_request());

    const docRef = doc(db, "books", book_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let book = docSnap.data();
        return dispatch(get_success({ book, book_success: 'Book is loaded!' }))
    } else {
        dispatch(get_failure({ message: 'Book not' }))
    }

};

const success = data => ({
    type: LOAD_BOOK_SUCCESS,
    payload: {
        ...data,
    }
});
const request = () => ({
    type: LOAD_BOOK_LOADING
});
const failure = error => ({
    type: LOAD_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});

const featured_success = data => ({
    type: LOAD_FEATURED_BOOK_SUCCESS,
    payload: {
        ...data,
    }
});
const featured_request = () => ({
    type: LOAD_FEATURED_BOOK_LOADING
});
const featured_failure = error => ({
    type: LOAD_FEATURED_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});



const user_books_success = data => ({
    type: LOAD_USER_BOOK_SUCCESS,
    payload: {
        ...data,
    }
});
const user_books_request = () => ({
    type: LOAD_USER_BOOK_LOADING
});
const user_books_failure = error => ({
    type: LOAD_USER_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});


const get_success = (data) => ({
    type: LOAD_GET_BOOK_SUCCESS,
    payload: {
        ...data,
    }
});
const get_request = () => ({
    type: LOAD_GET_BOOK_LOADING
});
const get_failure = error => ({
    type: LOAD_GET_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});


const add_success = (data) => ({
    type: LOAD_ADD_BOOK_SUCCESS,
    payload: {
        ...data,
    }
});
const add_request = () => ({
    type: LOAD_ADD_BOOK_LOADING
});
const add_failure = error => ({
    type: LOAD_ADD_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});


const delete_success = data => ({
    type: LOAD_DELETE_BOOK_SUCCESS,
    payload: {
        ...data
    }
});
const delete_request = () => ({
    type: LOAD_DELETE_BOOK_LOADING
});
const delete_failure = error => ({
    type: LOAD_DELETE_BOOK_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});

export default {
    getFeaturedBooks,
    getBooksBySearch,
    getUserBooks,
    addBook,
    deleteBook,
    getBookById,
}