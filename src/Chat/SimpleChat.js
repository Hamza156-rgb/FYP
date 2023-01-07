import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import DarkModeToggle from "react-dark-mode-toggle";
import { usePubNub } from "pubnub-react";
import {
    ChannelList,
    Chat,
    MemberList,
    MessageInput,
    MessageList,
    TypingIndicator,
    usePresence,
} from "@pubnub/react-chat-components";
import _ from 'lodash';

import "./Chat.css";

import { auth } from "../Services/Firebase";
import { Badge } from "react-bootstrap";


function SimpleChat(props) {

    const currentUser = auth.currentUser;
    const channelIds = props.channels.map((channel) => channel.id)
    const pubnub = usePubNub();

    const allChannels = props.channels.map((channel) => {
        let members = channel.members;

        let newName = '';
        let newThumb = '';

        Object.keys(members).forEach((value, i) => {
            let m = members[value];
            if (m.id !== currentUser.uid) {
                newName = m.name;
                newThumb = m.profileUrl;
            }
        })

        channel.name = newName;
        channel.custom = {
            thumb: newThumb
        };

        return channel;
    })

    let users = [];
    const members = _.map(props.channels, function (o) { return o.members; });
    members.forEach((values, key) => {
        Object.keys(values).forEach((value, index) => {
            users.push(values[value]);
        });
    });

    users = _.uniqBy(users, 'id');

    const [theme, setTheme] = useState("light");
    const [accessError, setAccessError] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showChannels, setShowChannels] = useState(true);
    const [oldMessageFetched, setOldMessageFetched] = useState(false);
    const [oldMessageCount, setOldMessageCount] = useState(null);
    //setOldMessageCount
    // usePresnce is one of the custom hooks provided by Chat Components
    const [presenceData] = usePresence({ channels: channelIds });
    const [currentChannel, setCurrentChannel] = useState(props.channel);

    const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map((o) => o.uuid);
    const presentUsers = users.filter((u) => presentUUIDs?.includes(u.id));

    /** Detect PubNub access manager */
    const handleStatus = (status) => {
        if (status.category === "PNAccessDeniedCategory") setAccessError(true);
    };

    const handleChangeChannel = (channel) => {
        setCurrentChannel(channel);
        setOldMessageCount(null)
    }

    const renderChannel = (props, i) => {
        console.log(props, i);

        return <div className={currentChannel.id == props.id ? "pn-channel pn-channel--active" : "pn-channel"} onClick={() => handleChangeChannel(props)}>
            {props.custom && props.custom.thumb && <img class="pn-channel__thumb" src={props.custom.thumb} alt="Channel thumb"></img>}
            <div class="pn-channel__title">
                <p class="pn-channel__name">{props.name}&nbsp;{oldMessageCount && oldMessageCount[props.id] > 0 && <Badge>new</Badge>}</p>
            </div>
        </div>
    }


    useEffect(() => {
        if (!oldMessageFetched) {
            const user = auth.currentUser;
            // const timetoken = await pubnub.time();

            // fetch all messages from last login time. 
            pubnub.messageCounts({
                channels: channelIds,
                channelTimetokens: [`${user.metadata.lastLoginAt}0000`]
            }).then((response) => {
                console.log('messageCounts', response);
                setOldMessageCount(response.channels);
                setOldMessageFetched(true);
            }).catch((error) => {
                // handle error
            });
        }

    }, [pubnub, channelIds]);

    /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
     * MessageInput, MemberList) and some elements to display additional information and to handle
     * custom behaviors (dark mode, showing/hiding panels, responsive design) */
    return (
        <div className={`app-simple ${theme}`}>
            {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
            <Chat
                theme={theme}
                users={users}
                currentChannel={currentChannel.id}
                channels={channelIds}
                onStatus={handleStatus}
            >
                {!accessError ? (
                    <>
                        <div className={`channels ${showChannels && "shown"}`}>
                            <div className="user">
                                {currentUser?.profileURL && (
                                    <img src={currentUser?.profileURL} alt="User avatar " />
                                )}
                                <h4>
                                    {currentUser?.displayName || currentUser?.email}{" "}
                                    <span className="close" onClick={() => setShowChannels(false)}>
                                        ✕
                                    </span>
                                </h4>
                            </div>
                            {/* <h4>Direct Chats</h4> */}
                            <div>
                                <ChannelList
                                    channels={allChannels}
                                    onChannelSwitched={(channel) => handleChangeChannel(channel)}
                                    channelRenderer={renderChannel}
                                />
                            </div>
                            {/* <div className="toggle">
                                <span>Dark Mode</span>
                                <DarkModeToggle
                                    size={50}
                                    checked={theme === "dark"}
                                    onChange={(isDark) => (isDark ? setTheme("dark") : setTheme("light"))}
                                />
                            </div> */}
                        </div>

                        <div className="chat">
                            <div
                                className={`people ${showMembers ? "active" : ""}`}
                                onClick={() => setShowMembers(!showMembers)}
                            >
                                <span>{presenceData[currentChannel.id]?.occupancy || 0}</span>
                                <span className="fa fa-users"></span>
                            </div>

                            <div className="info">
                                <span className="hamburger" onClick={() => setShowChannels(true)}>
                                    ☰
                                </span>
                                <h4>{currentChannel.name}</h4>
                                <small>{currentChannel.description}</small>
                                <hr />
                            </div>
                            <MessageList
                                fetchMessages={25} // fetch past messages
                            // welcomeMessages={welcomeMessages[currentChannel.id]}
                            // enableReactions
                            // reactionsPicker={<Picker />}
                            >
                                <TypingIndicator showAsMessage={false} />
                            </MessageList>
                            <MessageInput typingIndicator />
                        </div>

                        <div className={`members ${showMembers && "shown"}`}>
                            <h4>
                                Online Users
                                <span className="close" onClick={() => setShowMembers(false)}>
                                    ✕
                                </span>
                            </h4>
                            <MemberList members={presentUsers} />
                        </div>
                    </>
                ) : (
                    <div className="pubnub-error">
                        <h1>Warning! PubNub access manager enabled.</h1>
                        <p>
                            It looks like you have access manager enabled on your PubNub keyset. This sample app
                            is not adapted to work with PAM by default.
                        </p>
                        <p>
                            You can either disable PAM in the{" "}
                            <a href="https://dashboard.pubnub.com/">PubNub Admin Portal</a> or add custom code to
                            grant all necessary permissions by yourself. Please referer to the{" "}
                            <a href="https://pubnub.github.io/react-chat-components/docs/?path=/story/introduction-pam--page">
                                Chat Component docs
                            </a>{" "}
                            for more information.
                        </p>
                    </div>
                )}
            </Chat>
        </div>
    );
}

export default SimpleChat;