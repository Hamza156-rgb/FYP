import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

import { auth } from '../Services/Firebase';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css"

import "./Router.css";

import AuthAction from '../Auth/AuthAction';
import ChatAction from '../Chat/ChatAction';

import NavigationRouter from './NavigationRouter';

class AppBase extends Component {

    constructor(props) {
        super(props);
        props.userReq();

        this.state = {
            fetchMessages: false
        };
    }

    componentDidMount() {        
        // const { userReq } = this.props;
        // userReq();
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
    }

    UNSAFE_componentWillUpdate(newProps, oldProps) {
        const { getAllChannels } = this.props;

        // fetch all conversations
        if (newProps.authenticated && !oldProps.fetchMessages) {
            getAllChannels();
        }
    }

    signout = () => {
        const { signout } = this.props;
        signout();
    }

    render() {
        const { authenticated, user, loading = true } = this.props;

        const currentUser = auth.currentUser;
        let pubnub = null;

        if (authenticated && currentUser) {
            pubnub = new PubNub({
                publishKey: process.env.REACT_APP_PUBNUB_PUBLICKEY,
                subscribeKey: process.env.REACT_APP_PUBNUB_SECRETKEY,
                uuid: currentUser.uid,
            });
        }

        return (
            <Fragment>
                {loading === true ?
                    <div className="full-page-loading-container">
                        <div className="loader">
                            <i className="fa fa-4x fa-spin fa-spinner"></i>
                            <div className="loading-text">Please wait...</div>
                        </div>
                    </div>
                    :
                    (authenticated ?
                        <PubNubProvider client={pubnub}>
                            <NavigationRouter pubnub={pubnub} />
                        </PubNubProvider>
                        :
                        <NavigationRouter />
                    )
                }
            </Fragment>
        )
    };
}

const mapStateToProps = ({ auth = {}, }) => {

    return {
        ...auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    userReq: () => dispatch(AuthAction.getuser()),
    signout: () => dispatch(AuthAction.signout()),

    getAllChannels: () => dispatch(ChatAction.getAllChannels()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppBase)
