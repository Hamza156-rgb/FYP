import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';

import ContactAction from './ContactAction';

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: ''
        };
    }

    componentDidMount() {
    }

    addContact = (e) => {
        e.preventDefault();

        const {
            name,
            email,
            message
        } = this.state;

        if (!name) {
            return this.setState({
                error: "Name is Required!",
            });

        }
        if (!email) {
            this.setState({
                error: "Email is Required!",
            });
            return;
        }
        if (!message) {
            this.setState({
                error: "Message is Required!",
            });
            return;
        }

        this.setState({
            error: '',
        });

        const { contactUs } = this.props;

        contactUs({
            name,
            email,
            message
        });

    }

    render() {
        const { loading, success } = this.props;
        const error = this.props.error || this.state.error || '';

        return (
            <Fragment>
                <section className="Add-Book-Ad">
                    <Container>
                        <h1>Contact Us</h1>
                        <Row>
                            <Col>
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
                                    id="contact-add-form"
                                    onSubmit={this.addContact}
                                    noValidate
                                >


                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Name
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Enter your Name"
                                                onChange={(e) =>
                                                    this.setState({
                                                        name: e.target.value,
                                                    })
                                                }
                                                value={this.state.name}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Email
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter your Email"
                                                onChange={(e) =>
                                                    this.setState({
                                                        email: e.target.value,
                                                    })
                                                }
                                                value={this.state.email}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Message
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter your Message"
                                                style={{ height: '150px' }}
                                                onChange={(e) =>
                                                    this.setState({
                                                        message: e.target.value,
                                                    })
                                                }
                                                value={this.state.message}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Col xs={12}>
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
                                                Send Message
                                            </Button>
                                        </div>
                                    </Col>

                                    <br />
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
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ contact = {}, }) => {
    return {
        ...contact
    }
}

const mapDispatchToProps = (dispatch) => ({
    contactUs: (data) => dispatch(ContactAction.contactUs(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Contact)