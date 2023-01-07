import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import BooksAction, { RESET_FOR_ADD_NEW_BOOK } from './BooksAction';
import { Redirect, withRouter } from 'react-router-dom';

import { Categories, Languages } from '../Config/configuration';
import Helper from "../Services/Helper";

class AddBookPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // true if book is in editing phase
            editing: false,

            book_id: null,
            image: null,
            book_image: null,
            bookName: null,
            price: 0,
            condition: null,
            phone: null,
            address: null,
            category: null,
            description: null,
            language: null,

            redirect: "",
            ad_error: '',
        };
    }

    componentWillMount() {
        const id = this.props.match?.params?.id;

        if (id) {
            this.setState({
                book_id: id
            }, () => {
                this.props.getBookById(id)
            })
        } else {
            this.props.resetPage();
        }
    }


    // componentDidMount() {
    //     const id = this.props.match?.params?.id;

    //     if (id) {
    //         this.setState({
    //             book_id: id
    //         }, () => {
    //             this.props.getBookById(id)
    //         })
    //     }
    // }

    componentWillReceiveProps(newProps) {
        console.log(newProps);

        if (this.state.editing == false && newProps.book_loading == false && newProps.book_success && newProps.book) {
            console.log('Assign book to state');
            this.setState({
                editing: true,
                book_image: newProps.book.image,
                bookName: newProps.book.bookName,
                price: newProps.book.price,
                condition: newProps.book.condition,
                phone: newProps.book.phone,
                address: newProps.book.address,
                category: newProps.book.category,
                description: newProps.book.description,
                language: newProps.book.language,
                book_id: newProps.book.id,
            })
        }
    }

    handleImageChange = (e) => {
        
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0],
                book_image: URL.createObjectURL(e.target.files[0])


            });
        }
    };

    postBook = (e) => {
        e.preventDefault();

        const {
            book_id,
            image,
            book_image,
            bookName,
            price,
            condition,
            phone,
            address,
            category,
            description,
            language
        } = this.state;

        if (!bookName) {
            return this.setState({
                ad_error: "Book Name is Required!",
            });

        }
        if (!image && !book_image) {
            this.setState({
                ad_error: "Book Image is Required!",
            });
            return;
        }
        if ((price && price <= 0) || !price) {
            this.setState({
                ad_error: "Book Price is Required!",
            });
        }
        if (!condition) {
            this.setState({
                ad_error: "Book Condition is Required!",
            });
            return;
        }
        if (!phone) {
            this.setState({
                ad_error: "Phone Number is Required!",
            });
            return;
        }
        if (!address) {
            this.setState({
                ad_error: "Address is Required!",
            });
            return;
        }
        if (!category) {
            this.setState({
                ad_error: "Book Category is Required!",
            });
            return;
        }
        if (!language) {
            this.setState({
                ad_error: "Book language is Required!",
            });
            return;
        }
        if (!description) {
            this.setState({
                ad_error: "Book Description is Required!",
            });
            return;
        }


        this.setState({
            ad_error: ''
        });

        const { postBook } = this.props;
        postBook({
            id: book_id,
            image,
            book_image,
            bookName,
            price,
            condition,
            phone,
            address,
            category,
            description,
            language
        });

    }

    render() {
        const { loading, error, success, book_error, book_loading } = this.props;
        const { ad_error, redirect, book_id, book_image } = this.state;

        const show_error = book_error || error;
        const show_loading = book_loading || loading;

        if (redirect) {
            return <Redirect to={redirect} />;
        }

        return (
            <Fragment>
                <section className="Add-Book-Ad">
                    <Container>
                        <h1> {book_id ?
                            'Edit Book' :
                            'Add Book'}

                            {show_loading && <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="m-r-5 m-l-5"
                            />}
                        </h1>
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
                                {show_error && (
                                    <Alert
                                        key={"danger"}
                                        variant={"danger"}
                                    >
                                        {show_error}
                                    </Alert>

                                )}
                                {ad_error && (
                                    <Alert
                                        key={"danger"}
                                        variant={"danger"}
                                    >
                                        {ad_error}
                                    </Alert>

                                )}
                                <Form
                                    id="book-add-form"
                                    onSubmit={this.postBook}
                                    noValidate
                                >
                                    {book_id && <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Book Id
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                
                                                name="bookId"
                                                placeholder="Book Id"
                                                value={book_id}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>}

                                    <Form.Group as={Row} className="mb-3">
                                        <Col sm={{ span: 4, offset: 2 }}>
                                            {this.state.imag || book_image && (
                                                <img
                                                    class="img-thumbnail w-250-max"
                                               
                                                    src={book_image || URL.createObjectURL(this.state.image)}
                                                    alt="upload images"
                                                />
                                            )}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formFile" className="mb-3">
                                        <Form.Label column sm="2">
                                            Book Thumbnail
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control type="file"
                                                 accept=".gif,.jpg,.jpeg,.png"
                                                
                                                onChange={this.handleImageChange}
                                                className="form-control-file"
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Book Name
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                type="text"
                                                name="bookName"
                                                placeholder="Book Name"
                                                onChange={(e) =>
                                                    this.setState({
                                                        bookName: e.target.value,
                                                    })
                                                }
                                                value={this.state.bookName}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Description
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter Book Description"
                                                style={{ height: '100px' }}
                                                onChange={(e) =>
                                                    this.setState({
                                                        description: e.target.value,
                                                    })
                                                }
                                                value={this.state.description}

                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Price
                                        </Form.Label>

                                        <Col sm="10">
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>Rs.</InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    name="price"
                                                    placeholder="Enter Book Price"
                                                    onChange={(e) =>
                                                        this.setState({
                                                            price: e.target.value,
                                                        })
                                                    }
                                                    value={this.state.price}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>


                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Condition
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Select aria-label="Select Condition"
                                                placeholder="Select Book Condition"
                                                onChange={(e) =>
                                                    this.setState({
                                                        condition: e.target.value,
                                                    })
                                                }
                                                value={this.state.condition} required>
                                                <option value=""></option>
                                                <option value="new">New</option>
                                                <option value="old">Old</option>
                                                <option value="used">Used</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Category
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Select aria-label="Select Category"
                                                placeholder="Select Book Category"
                                                onChange={(e) =>
                                                    this.setState({
                                                        category: e.target.value,
                                                    })
                                                }
                                                value={this.state.category} required>
                                                <option value=""></option>
                                                {Categories.map((item, index) =>
                                                    <option key={index} value={item}>{Helper.capitalize(item)}</option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Language
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Select aria-label="Select Language"
                                                placeholder="Select Book Language"
                                                onChange={(e) =>
                                                    this.setState({
                                                        language: e.target.value,
                                                    })
                                                }
                                                value={this.state.language} required>
                                                <option value=""></option>
                                                {Languages.map((item, index) =>
                                                    <option key={index} value={item}>{Helper.capitalize(item)}</option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <hr></hr>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Phone
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                type="number"
                                                name="Phone"
                                                placeholder="Enter Phone Number"
                                                onChange={(e) =>
                                                    this.setState({
                                                        phone: e.target.value,
                                                    })
                                                }
                                                value={this.state.phone}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3" >
                                        <Form.Label column sm="2">
                                            Address
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder="Enter Address"
                                                onChange={(e) =>
                                                    this.setState({
                                                        address: e.target.value,
                                                    })
                                                }
                                                value={this.state.address}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>


                                    <Col xs={12}>
                                        <div className="d-grid gap-2">
                                            <Button disabled={show_loading} type="submit" variant="primary" size="lg">
                                                {show_loading && <Spinner
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
                                    {ad_error && (
                                        <Alert
                                            key={"danger"}
                                            variant={"danger"}
                                        >
                                            {ad_error}
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

const mapStateToProps = ({ books }) => {
    return {
        loading: books.add_loading,
        error: books.add_error,
        success: books.add_success,

        book: books.book,
        book_loading: books.book_loading,
        book_success: books.book_success,
        book_error: books.book_error,
    }
}

const mapDispatchToProps = (dispatch) => ({
    postBook: (data) => dispatch(BooksAction.addBook(data)),
    getBookById: (book_id) => dispatch(BooksAction.getBookById(book_id)),
    resetPage: () => { dispatch({ type: RESET_FOR_ADD_NEW_BOOK }) }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddBookPost))