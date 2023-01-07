import React, { useState, useEffect } from 'react';
import { usePubNub } from 'pubnub-react';
import { auth } from '../Services/Firebase';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';

function MessageLink(props) {
    const pubnub = usePubNub();

    const channelIds = props.channels?.map((channel) => channel.id)
    const [channels] = useState(channelIds);
    const [showMessages, setShowMessages] = useState(false);

    const handleMessage = messageEvent => {
        console.log('New Message Receieved');
        setShowMessages(true);
    };

    useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
    }, [pubnub, channels]);



    useEffect(() => {
        const user = auth.currentUser;
        // const timetoken = await pubnub.time();
        
        // fetch all messages from last login time. 
        pubnub.messageCounts({
            channels: channels,
            channelTimetokens: [`${user.metadata.lastLoginAt}0000`]
        }).then((response) => {
            console.log('messageCounts', response)
            const messages = response.channels;
            let count = 0;
            Object.keys(messages).forEach((i, j) => {
                count = count + messages[i];
            })

            if(count > 0) {
                setShowMessages(true);
            }

        }).catch((error) => {
            // handle error
        });

    }, [pubnub, channels]);

    return (
        <Link to={"/messages"} onClick={() => setShowMessages(false)} className="nav-link">Messages  {showMessages && <Badge bg="danger" pill> </Badge>}</Link>
    );
}

export default MessageLink;

