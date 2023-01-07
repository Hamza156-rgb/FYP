
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);


export const firebaseErrors = (code) => {
	let message = code;
	let str = code;
	const index = str.indexOf("/");
	message = str.slice(index + 1, str.length);
	message = message.split("-").join(" ");
	message = message.charAt(0).toUpperCase() + message.slice(1);
	return message;
}

// {
// 	'auth/user-not-found' : 'User not found',
// 	'auth/wrong-password' : 'Wrong password',
// 	'auth/email-already-in-use' : 'Email already in use'
// }
