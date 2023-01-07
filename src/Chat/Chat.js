import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';

import { auth } from '../Services/Firebase';

import ChatAction from './ChatAction';
import SimpleChat from './SimpleChat';
import OpenChat from './OpenChat';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css";
import AuthAction from '../Auth/AuthAction';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { getAllChannels, loading } = this.props;
        if (!loading) {
            getAllChannels();
        }
    }

    UNSAFE_componentWillUpdate(newProps, oldProps) {
        console.log(newProps);
    }

    render() {
        const { channels, channel, loading, error } = this.props;

        return (
            <Fragment>
                <section>
                    <Container>
                        <Row>
                            <Col sm={12}>

                                {error && (
                                    <Alert
                                        className={"mt-3"}
                                        key={"danger"}
                                        variant={"danger"}
                                    >
                                        {error}
                                    </Alert>

                                )}

                                {loading ?
                                    <div className="loading-container">
                                        <div className="loader">
                                            <Spinner animation="grow" variant="primary" />
                                            <Spinner animation="grow" variant="secondary" />
                                            <Spinner animation="grow" variant="success" />
                                            <Spinner animation="grow" variant="danger" />
                                            <Spinner animation="grow" variant="warning" />
                                            <Spinner animation="grow" variant="info" />
                                            <Spinner animation="grow" variant="light" />
                                            <Spinner animation="grow" variant="dark" />
                                        </div>
                                    </div>
                                    :
                                    (channels && channels.length !== 0 ?
                                        // <PubNubProvider client={pubnub}>
                                        <SimpleChat channels={channels} channel={channel} />
                                        // </PubNubProvider>
                                        :

                                        <Alert
                                            variant={"danger"}
                                            className="text-center mt-3"
                                        >
                                            "No Chats Found!"
                                        </Alert>
                                    )
                                }

                            </Col>
                        </Row>
                    </Container>
                </section>
            </Fragment>

        )
    }
}

const mapStateToProps = ({ chat = {}, }) => {
    return {
        error: chat.error || chat.add_error,
        loading: chat.loading || chat.add_loading,
        success: chat.success || chat.add_success,
        channels: chat.channels,
        channel: chat.channel,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAllChannels: () => dispatch(ChatAction.getAllChannels()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)