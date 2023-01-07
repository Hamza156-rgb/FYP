import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Row, Col, Card, Form, Spinner, Alert, FloatingLabel } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom'
import AuthAction from './AuthAction';

import FacebookComponent from './FacebookAuth';
import GoogleComponent from './GoogleAuth';

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: '',
            email: "",
            name: '',
            password: "",
            error: '',
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
        if (newProps.authenticated == true) {
            this.setState({ redirect: "/ads/add" })
        }
    }

    signup = (e) => {
        e.preventDefault();

        const { signup } = this.props;
        const { email, password, name } = this.state;

        signup({ email, password, name });
    }

    render() {
        const { redirect } = this.state;
        const { loading, error, success } = this.props;

        if (redirect) {
            return <Redirect to={{ pathname: redirect }} />
        }

        return (

            <Fragment>
                <section className="section-login section-signup">
                    <div className="overlay">
                        <Container>
                            <Row>
                                <Card className="login-container">
                                    <Card.Title className="text-center">
                                        <span className="fa fa-lock fa-2x lock-icon"></span>
                                        <h2 className="mt-3 text-center">Sign-Up</h2></Card.Title>
                                    <Card.Body className="text-left mb-1">

                                        <Form
                                            id="book-add-form"
                                            onSubmit={this.signup}
                                            noValidate
                                        >

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

                                            <FloatingLabel
                                                controlId="name"
                                                label="Name"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    name="Name"
                                                    placeholder="Enter Your Name"
                                                    onChange={(e) =>
                                                        this.setState({
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    value={this.state.name}
                                                    required
                                                />
                                            </FloatingLabel>


                                            <FloatingLabel
                                                controlId="email"
                                                label="email"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Your Email"
                                                    onChange={(e) =>
                                                        this.setState({
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    value={this.state.email}
                                                    required
                                                />
                                            </FloatingLabel>

                                            <FloatingLabel
                                                controlId="password"
                                                label="Password"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter Your Password"
                                                    onChange={(e) =>
                                                        this.setState({
                                                            password: e.target.value,
                                                        })
                                                    }
                                                    value={this.state.password}
                                                    required
                                                />
                                            </FloatingLabel>


                                            <Col sm={12} className={'submit-button'}>
                                                <div className="d-grid gap-2"> <Button disabled={loading} type="submit" variant="primary">
                                                    {loading && <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="m-r-5"
                                                    />}
                                                    Register
                                                </Button></div>
                                            </Col>

                                            <Col sm={12} style={{ textAlign: 'right' }}>
                                                <Link to={"/login"}>
                                                    Have an account? Login</Link>
                                            </Col>

                                            <div className="social-login">
                                                <GoogleComponent />
                                                <span className="m-r-5"></span>
                                                <FacebookComponent />
                                            </div>

                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Container>
                    </div>
                </section>
            </Fragment >
        )
    }
}

const mapStateToProps = ({ auth = {}, }) => {
    return {
        ...auth,
        loading: auth.auth_loading,
        error: auth.auth_error
    }
}

const mapDispatchToProps = (dispatch) => ({
    signup: (data) => dispatch(AuthAction.signup(data))
})



export default connect(mapStateToProps, mapDispatchToProps)(Signup)