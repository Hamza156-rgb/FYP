import authApi from './AuthApi'
import { auth, db, firebaseErrors, storage } from "../Services/Firebase";
import { GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, updateProfile, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc, setDoc } from 'firebase/firestore';
import Helper from '../Services/Helper';

export const USER_LOGOUT = 'REDUX_THUNK_USER_LOGOUT';

export const LOAD_USER_UPDATE_LOADING = 'REDUX_THUNK_LOAD_USER_UPDATE_LOADING';
export const LOAD_USER_UPDATE_SUCCESS = 'REDUX_THUNK_LOAD_USER_UPDATE_SUCCESS';
export const LOAD_USER_UPDATE_ERROR = 'REDUX_THUNK_LOAD_USER_UPDATE_ERROR';

export const LOAD_AUTH_LOADING = 'REDUX_THUNK_LOAD_AUTH_LOADING';
export const LOAD_AUTH_SUCCESS = 'REDUX_THUNK_LOAD_AUTH_SUCCESS';
export const LOAD_AUTH_ERROR = 'REDUX_THUNK_LOAD_AUTH_ERROR';

export const LOAD_AUTH_ACTION_LOADING = 'REDUX_THUNK_LOAD_AUTH_ACTION_LOADING';
export const LOAD_AUTH_ACTION_SUCCESS = 'REDUX_THUNK_LOAD_AUTH_ACTION_SUCCESS';
export const LOAD_AUTH_ACTION_ERROR = 'REDUX_THUNK_LOAD_AUTH_ERROR';

const userRef = collection(db, "users");
/* When a user is craeted / updated update in firestore as well */

const signout = () => dispatch => {
    dispatch(action_request());

    authApi.signout()
        .then(() => {
            console.log('Logged out!');
            dispatch({
                type: 'USER_LOGOUT'
            })

            return dispatch(action_success({ user: null, token: null, authenticated: false }))
        })
        .catch(error => dispatch(failure(error)))
};


const login = ({ email, password }) => dispatch => {
    dispatch(action_request());

    if (!email || !password) {
        return dispatch(action_failure({ message: 'Required fields are missing' }))
    }

    authApi.signin(email, password)
        .then(userCredential => {
            console.log(userCredential);
            const user = userCredential.user;
            return dispatch(action_success({ authenticated: true, user }))
        })
        .catch(error => dispatch(action_failure(error)))
};

const signup = ({ email, password, name }) => async (dispatch) => {
    dispatch(action_request());

    if (!email || !password || !name) {
        return dispatch(action_failure({ message: 'Required fields are missing' }))
    }

    authApi.signup(email, password)
        .then(userCredential => {
            console.log(userCredential);
            const user = userCredential.user;
            user.displayName = name;

            // update user with name with out waiting for response
            updateProfile(user, {
                displayName: user.displayName
            })

            const userDoc = {
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
            }

            /* adding user to firestore */
            setDoc(doc(db, "users", user.uid), userDoc)

            return dispatch(action_success({ authenticated: true, user }))
        })
        .catch(error => dispatch(action_failure(error)))
};

const googleLogin = () => dispatch => {
    dispatch(action_request());

    authApi.googlelogin()
        .then(result => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            console.log(token, user);

            const userDoc = {
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL
            }

            /* adding user to firestore */
            setDoc(doc(db, "users", user.uid), userDoc)

            // writeUserData(user);
            return dispatch(action_success({ authenticated: true, user, token }))
        })
        .catch(error => dispatch(action_failure(error)))
};

const facebookLogin = () => dispatch => {
    dispatch(action_request());

    authApi.facebookLogin()
        .then(result => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            console.log(token, user);

            const userDoc = {
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL
            }

            /* adding user to firestore */
            setDoc(doc(db, "users", user.uid), userDoc)

            // writeUserData(user);
            return dispatch(action_success({ authenticated: true, user, token }))
        })
        .catch(error => dispatch(action_failure(error)))
};


const getuser = () => dispatch => {
    dispatch(request());

    onAuthStateChanged(auth, user => {
        if (user) {
            return dispatch(success({ authenticated: true, user }))
        } else {
            return dispatch(success({ authenticated: false, user: null }))
        }
    })
}

const updateUserProfile = ({ displayName, image }) => dispatch => {
    dispatch(user_update_request());

    if (!displayName && !image) {
        return dispatch(user_update_failure({ message: 'Required field is missing' }));
    }

    const user = auth.currentUser;

    if (image) {
        const imageId = Helper.simpleUniqueId('image-');
        const storageRef = ref(storage, 'photo/' + imageId);
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg',
        };

        uploadBytes(storageRef, image, metadata).then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((downloadURL) => {
                    console.log('Image available at', downloadURL);

                    let userDoc = {
                        photoURL: downloadURL
                    };

                    if (displayName) {
                        userDoc.displayName = displayName;
                    }

                    // update profile in auth
                    updateProfile(user, userDoc).then(() => {
                        let newUser = { ...auth.currentUser, ...userDoc };

                        // update profile in firestore
                        updateDoc(doc(db, "users", newUser.uid), {
                            ...userDoc
                        });

                        return dispatch(user_update_success({ success: 'User updatd Successfully!', user: newUser }))
                    }).catch((error) => {
                        return dispatch(user_update_failure(error))
                    });

                })
                .catch((error) =>
                    dispatch(user_update_failure(error))
                )

        });
    } else {
        // update profile in auth
        updateProfile(user, {
            displayName
        }).then(() => {
            let newUser = { ...auth.currentUser, displayName };

            // update profile in firestore
            updateDoc(doc(db, "users", newUser.uid), {
                displayName: displayName
            });

            return dispatch(user_update_success({ success: 'User updatd Successfully!', user: newUser }))
        }).catch((error) => {
            return dispatch(user_update_failure(error))
        });
    }

}

const updateUserPassword = ({ newPassword }) => dispatch => {
    const user = auth.currentUser;

    updatePassword(user, newPassword).then(() => {
        // Update successful.
    }).catch((error) => {
        // An error ocurred
        // ...
    });
}


const success = data => ({
    type: LOAD_AUTH_SUCCESS,
    payload: {
        ...data,
    }
});

const request = () => ({
    type: LOAD_AUTH_LOADING
});

const failure = error => ({
    type: LOAD_AUTH_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});



const action_success = data => ({
    type: LOAD_AUTH_ACTION_SUCCESS,
    payload: {
        ...data,
    }
});

const action_request = () => ({
    type: LOAD_AUTH_ACTION_LOADING
});

const action_failure = error => ({
    type: LOAD_AUTH_ACTION_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});



const user_update_request = () => ({
    type: LOAD_USER_UPDATE_LOADING
});

const user_update_failure = error => ({
    type: LOAD_USER_UPDATE_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});

const user_update_success = data => ({
    type: LOAD_USER_UPDATE_SUCCESS,
    payload: {
        ...data,
    }
});

export default {
    login,
    signup,
    googleLogin,
    facebookLogin,
    signout,
    getuser,
    updateUserProfile,
}