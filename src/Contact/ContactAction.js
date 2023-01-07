import { db, firebaseErrors } from "../Services/Firebase";
import {
    doc, setDoc, Timestamp,
} from "firebase/firestore";

import Helper from '../Services/Helper';

export const LOAD_CONTACT_LOADING = 'REDUX_THUNK_LOAD_CONTACT_LOADING';
export const LOAD_CONTACT_SUCCESS = 'REDUX_THUNK_LOAD_CONTACT_SUCCESS';
export const LOAD_CONTACT_ERROR = 'REDUX_THUNK_LOAD_CONTACT_ERROR';

const contactUs = (data) => async (dispatch) => {
    dispatch(request());

    const {
        name,
        email,
        message
    } = data;

    const contact_id = Helper.simpleUniqueId('contact-');

    const docData = {
        id: contact_id,
        postedAt: Timestamp.fromDate(new Date()),
        name,
        email,
        message
    };

    setDoc(doc(db, "contacts", contact_id), docData)
        .then((result) => {
            console.log(result);

            return dispatch(success())
        })
        .catch((error) => {
            console.log(error);
            return dispatch(failure(error))
        })
};

const success = data => ({
    type: LOAD_CONTACT_SUCCESS,
    payload: {
        ...data,
    }
});

const request = () => ({
    type: LOAD_CONTACT_LOADING
});

const failure = error => ({
    type: LOAD_CONTACT_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});


export default {
    contactUs,
}