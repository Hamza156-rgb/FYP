import React, { useState, useEffect } from 'react';
import { usePubNub } from 'pubnub-react';
import { auth } from '../Services/Firebase';

function OpenChat(props) {

    const user = auth.currentUser;
    const channelIds = props.channels.map((channel) => channel.id)
    const [channelSelected, setChannelSelected] = useState(props.channel);

    const pubnub = usePubNub();
    const [channels] = useState(channelIds);
    const [currentChannel, setCurrentChannel] = useState(props.channel.id);
    const [messages, addMessage] = useState([]);
    const [message, setMessage] = useState('');

    const handleMessage = event => {
        const message = event.message;
        console.log(message);

        if (typeof message === 'string' || message.hasOwnProperty('text')) {
            const text = message.text || message;
            addMessage(messages => [...messages, text]);
        }
    };

    const sendMessage = message => {
        if (message) {
            pubnub
                .publish({ channel: currentChannel, message })
                .then(() => setMessage(''));
        }
    };

    useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
    }, [pubnub, channels]);

    useEffect(() => {
        pubnub.messageCounts({
            channels: [currentChannel],
            channelTimetokens: [new Date()]
        }).then((response) => {
            console.log('messageCounts', response)
        }).catch((error) => {
            // handle error
        });

        pubnub.fetchMessages(
            {
                channels: [currentChannel],
                //   end: '15343325004275466',
                count: 25 // default/max is 25 messages for multiple channels (up to 500)
            }).then((response) => {
                console.log('messageCounts', response)
                // addMessage(messages => [messages, response]);

            }).catch((error) => {
                // handle error
            });
    }, [currentChannel])

    return (
        <div style={pageStyles}>
            <div style={chatStyles}>
                <div style={headerStyles}>React Chat Example {channelSelected.name}</div>
                <div style={listStyles}>
                    {messages.map((message, index) => {
                        return (
                            <div key={`message-${index}`} style={messageStyles}>
                                {message}
                            </div>
                        );
                    })}
                </div>
                <div style={footerStyles}>
                    <input
                        type="text"
                        style={inputStyles}
                        placeholder="Type your message"
                        value={message}
                        onKeyPress={e => {
                            if (e.key !== 'Enter') return;
                            sendMessage(message);
                        }}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <button
                        style={buttonStyles}
                        onClick={e => {
                            e.preventDefault();
                            sendMessage(message);
                        }}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

const pageStyles = {
    alignItems: 'center',
    background: '#282c34',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
};

const chatStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '50vh',
    width: '50%',
};

const headerStyles = {
    background: '#323742',
    color: 'white',
    fontSize: '1.4rem',
    padding: '10px 15px',
};

const listStyles = {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
    padding: '10px',
};

const messageStyles = {
    backgroundColor: '#eee',
    borderRadius: '5px',
    color: '#333',
    fontSize: '1.1rem',
    margin: '5px',
    padding: '8px 15px',
};

const footerStyles = {
    display: 'flex',
};

const inputStyles = {
    flexGrow: 1,
    fontSize: '1.1rem',
    padding: '10px 15px',
};

const buttonStyles = {
    fontSize: '1.1rem',
    padding: '10px 15px',
};

export default OpenChat;
