import { auth, db, storage, firebaseErrors } from "../Services/Firebase";
import Helper from "../Services/Helper";

import {
    collection, query, where, getDocs,
    doc, setDoc, updateDoc,
} from "firebase/firestore";
import _ from "lodash";

export const LOAD_ADD_CHANNEL_LOADING = 'REDUX_THUNK_LOAD_ADD_CHANNEL_LOADING';
export const LOAD_ADD_CHANNEL_SUCCESS = 'REDUX_THUNK_LOAD_ADD_CHANNEL_SUCCESS';
export const LOAD_ADD_CHANNEL_ERROR = 'REDUX_THUNK_LOAD_ADD_CHANNEL_ERROR';

export const LOAD_CHANNEL_LOADING = 'REDUX_THUNK_LOAD_CHANNEL_LOADING';
export const LOAD_CHANNEL_SUCCESS = 'REDUX_THUNK_LOAD_CHANNEL_SUCCESS';
export const LOAD_CHANNEL_ERROR = 'REDUX_THUNK_LOAD_CHANNEL_ERROR';

const chatRef = collection(db, "channel")

const createChannel = (data) => async (dispatch) => {
    dispatch(add_request())

    const { user } = data;
    const user_uid = user.uid;
    const currentUser = auth.currentUser;

    const q = query(chatRef, where(`member_ids`, "array-contains", currentUser.uid))

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) {

        const channels = querySnapshot.docs.map((doc) => {
            return doc.data();
        });

        let filterd = channels.filter((channel) => {
            let members = channel.members;
            let users = _.map(members, (i) => i)
            let userIndex = _.findIndex(users, (o) => { return o.id == user_uid; });
            return userIndex > -1;
        });

        if ((channels && channels.length !== 0) && (filterd && filterd.length !== 0)) {

            let selectedChannel = filterd[0];

            //update channel with latest information
            // update user names in channel record
            selectedChannel.members = {
                [currentUser.uid]: {
                    id: currentUser.uid,
                    name: currentUser.displayName || currentUser.email,
                    profileUrl: currentUser.photoURL || '',
                    updated: new Date(),
                },
                [user.uid]: {
                    id: user.uid,
                    name: user.displayName || user.email,
                    profileUrl: user.photoURL || '',
                    updated: new Date(),
                }
            }

            await updateDoc(doc(db, "channel", selectedChannel.id), {
                members: selectedChannel.members,
            })
                .then((result) => {
                    console.log(result);

                    return dispatch(add_success({ channels, channel: selectedChannel }))
                })
                .catch((error) => {

                    console.log(error);
                    return dispatch(add_failure(error))
                })

        } else {

            // if not found create new channel

            const channelId = Helper.simpleUniqueId('channel-');

            let members = {
                [currentUser.uid]: {
                    id: currentUser.uid,
                    name: currentUser.displayName || currentUser.email,
                    profileUrl: currentUser.photoURL || '',
                    updated: new Date(),
                },
                [user.uid]: {
                    id: user.uid,
                    name: user.displayName || user.email,
                    profileUrl: user.photoURL || '',
                    updated: new Date(),
                }
            }

            const docData = {
                id: channelId,
                members,
                member_ids: [currentUser.uid, user.uid],
                name: channelId,
                discription: `Direct Chat between Buyer and Seller`
            }

            await setDoc(doc(db, "channel", channelId), docData)
                .then((result) => {
                    console.log(result);

                    const allChannels = [...channels, docData];

                    return dispatch(add_success({ channels: allChannels, channel: docData }))
                })
                .catch((error) => {

                    console.log(error);
                    return dispatch(add_failure(error))
                })

        }

    }

};


const getAllChannels = () => async (dispatch) => {
    dispatch(request());
    const currentUser = auth.currentUser;

    const q = query(chatRef, where(`member_ids`, "array-contains", currentUser.uid))
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) {
        const channels = querySnapshot.docs.map((doc) => {
            return doc.data();
        });

        return dispatch(success({ channels, channel: channels[0] }))
    } else {
        return dispatch(failure({ message: 'Chats Not Found' }))
    }

};


const add_success = data => ({
    type: LOAD_ADD_CHANNEL_SUCCESS,
    payload: {
        ...data,
    }
});

const add_request = () => ({
    type: LOAD_ADD_CHANNEL_LOADING
});

const add_failure = error => ({
    type: LOAD_ADD_CHANNEL_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});

const success = data => ({
    type: LOAD_CHANNEL_SUCCESS,
    payload: {
        ...data,
    }
});

const request = () => ({
    type: LOAD_CHANNEL_LOADING
});

const failure = error => ({
    type: LOAD_CHANNEL_ERROR,
    payload: {
        error: error.code ? firebaseErrors(error.code) : error.message,
    }
});




export default {
    createChannel,
    getAllChannels,
}