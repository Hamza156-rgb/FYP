import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, ListGroup, ListGroupItem, Container, Row, Col, Alert, Form, Spinner, Image } from 'react-bootstrap';

import AuthAction from '../Auth/AuthAction';

import userImage from "../images/user-image.png";

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: null,
            displayName: '',

            loading: '',
            error: '',
            success: '',
        };
    }

    componentDidMount() {
        // const { userReq } = this.props;
        // userReq();
    }

    componentWillReceiveProps(newProps) {
    }

    handleImageChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0],
            });
        }
    };

    updateProfile = (e) => {
        e.preventDefault();

        const {
            image,
            displayName
        } = this.state;

        this.setState({
            error: '',
        }, () => {
            const { updateProfile } = this.props;
            updateProfile({ displayName, image });
        });

    }

    render() {
        const { user, loading, success, error } = this.props;

        return (
            <Container className="User-Profile">

                <Row>

                    <Col sm={12} md={6}>
                        <h1>Profile</h1>

                        <Form.Group as={Row} className="mb-3">

                            <Col className="text-center">
                                <Image width="150px" src={user.photoURL || userImage} rounded thumbnail />
                            </Col>


                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">
                                Name
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    readOnly defaultValue={user.displayName}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">
                                Email
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    readOnly defaultValue={user.email}
                                />
                            </Col>

                        </Form.Group>

                    </Col>
                    <Col sm={12} md={6}>
                        <h1>Update Profile</h1>

                        {success && (
                            <Alert
                                key={"success"}
                                variant={"success"}
                            >
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert
                                key={"danger"}
                                variant={"danger"}
                            >
                                {error}
                            </Alert>

                        )}

                        <Form
                            id="book-add-form"
                            onSubmit={this.updateProfile}
                            noValidate
                        >
                            <Form.Group as={Row} className="mb-3">
                                <Col sm={12}>
                                    {this.state.image && (
                                        <img
                                            class="img-thumbnail w-250-max"
                                            src={URL.createObjectURL(this.state.image)}
                                            alt="upload Photo"
                                        />
                                    )}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formFile" className="mb-3">
                                <Col sm="12">
                                    <Form.Control type="file"
                                        onChange={this.handleImageChange}
                                        className="form-control-file"
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" >
                                <Col sm="12">
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Enter your Name"
                                        onChange={(e) =>
                                            this.setState({
                                                displayName: e.target.value,
                                            })
                                        }
                                        value={this.state.displayName}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Col sm="12">
                                <div className="d-grid gap-2">
                                    <Button disabled={loading} type="submit" variant="primary" size="lg">
                                        {loading && <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="m-r-5"
                                        />}
                                        SUBMIT
                                    </Button>
                                </div>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}


const mapStateToProps = ({ auth = {} }) => {
    return {
        ...auth,
        user: auth.user,
        loading: auth.update_loading
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateProfile: (data) => dispatch(AuthAction.updateUserProfile(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(User)