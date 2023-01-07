
import { auth } from "../Services/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, signOut } from "firebase/auth";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signin = (email, password) => signInWithEmailAndPassword(auth, email, password);
const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
const googlelogin = () => signInWithPopup(auth, googleProvider);
const facebookLogin = () => signInWithPopup(auth, facebookProvider);
const signout = () => signOut(auth);

export default {
    signin,
    signup,
    googlelogin,
    facebookLogin,
    signout
}