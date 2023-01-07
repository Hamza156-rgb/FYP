import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Alert, Badge, Spinner, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom'
import Moment from 'react-moment';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css";

import BooksAction from './BooksAction';
import ChatAction from '../Chat/ChatAction';


class BookListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: ''
        };
    }

    componentDidMount() {
        const { getBooksBySearch } = this.props;
        getBooksBySearch({});

    }

    UNSAFE_componentWillUpdate(newProps, oldProps) {
        // console.log(newProps);

        // if (newProps.loading !== oldProps.loading) {
        //     this.setState({
        //         ...newProps
        //     });
        // }

    }

    createChat = (user) => {
        const { createChat } = this.props;
        createChat({ user });
        this.setState({
            redirect: '/messages'
        });
    }

    onDeleteBook = (book) => {
        let confirm = window.confirm(`Do you want to delete ${book.bookName} book?`);
        if(confirm) {
            console.log("delete This book", book);
            this.props.deleteSelectedBook(book);
        }
      
    };

    render() {
        const { redirect } = this.state;
        const { loading, error, allBooks, loggedIn, delete_loading, user } = this.props;

        if (redirect) {
            return <Redirect to={{ pathname: redirect }} />
        }

        return (
            <Fragment>
                <section className="book-listing">
                    {error && (
                        <Alert
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
                        <Container id="new-products">
                            <Row>
                                {allBooks && allBooks.length == 0 && (
                                    <Alert
                                        variant={"danger"}
                                        className="text-center mt-3"
                                    >
                                        "No Ads Found!"
                                    </Alert>
                                )}

                                {allBooks && allBooks.map((book, index) =>
                                    <Col sm={12} key={'book' + index} id={'book' + index}>
                                        <div className="item">
                                            <div className="product-item d-flex flex-column flex-sm-column flex-md-row flex-lg-row">
                                                <div className="carousel-thumb">
                                                    <img src={book.image} alt="Book thumbnail" />
                                                </div>


                                                <div className="top-right">
                                                    {loggedIn && user.uid === book.owner.uid &&
                                                        <Link to={`/ads/${book.id}`}>
                                                            <Button
                                                                className="m-r-5"
                                                                variant="warning"
                                                                text={"dark"}
                                                                size="sm"
                                                            >
                                                                <span className="fa fa-edit"></span>
                                                            </Button>
                                                        </Link>}

                                                    {loggedIn && user.uid === book.owner.uid && (<Button
                                                        disabled={delete_loading}
                                                        variant="danger"
                                                        onClick={() =>
                                                            this.onDeleteBook(
                                                                book
                                                            )
                                                        }
                                                        size="sm"
                                                    >
                                                        {delete_loading && <Spinner
                                                            as="span"
                                                            animation="grow"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="m-r-5"
                                                        />}
                                                        <span className="fa fa-trash"></span>
                                                    </Button>
                                                    )}

                                                </div>

                                                <div className="details">
                                                    <div className="tags">
                                                        {book.featured &&
                                                            <Badge bg="warning" text="dark">Featured</Badge>
                                                        }
                                                        {book.category &&
                                                            <Badge bg="info">Category: {book.category}</Badge>
                                                        }
                                                        {book.language &&
                                                            <Badge bg="success">Language: {book.language}</Badge>
                                                        }
                                                        {book.condition &&
                                                            <Badge bg="danger">Condition: {book.condition}</Badge>
                                                        }
                                                    </div>
                                                    <h2 className="item-name text-capitalize">{book.bookName}</h2>
                                                    <div className="discription text-capitalize">{book.description}</div>

                                                    <div className="price"> Rs {book.price}/-</div>

                                                    <div className="bottom-right">
                                                        {book.postedAt &&
                                                            <div className="time mb-1">
                                                                <span className="fa fa-clock-o"></span>
                                                                <span className="m-l-5 text"><Moment fromNow>{new Date(book.postedAt.seconds * 1000)}</Moment> </span>
                                                            </div>
                                                        }
                                                    </div>

                                                    <div className="">
                                                        <div className="seller">
                                                            <span className="fa fa-user"></span>
                                                            <span className="m-l-5 text text-capitalize">
                                                                {book.owner && (book.owner.displayName || book.owner.email)}
                                                            </span>
                                                        </div>
                                                        <div className="address">
                                                            <span className="fa fa-map-marker"></span>
                                                            <span className="m-l-5 text text-capitalize">
                                                                {book.address}
                                                            </span>
                                                        </div>
                                                        <div className="phone">
                                                            <span className="fa fa-phone"></span>
                                                            <span className="m-l-5 text">
                                                                {book.phone}
                                                            </span>
                                                        </div>
                                                        {(loggedIn && user.uid !== book.owner.uid) && <div className="phone">
                                                            <Button onClick={() => this.createChat(book.owner)} variant="primary" size={"sm"}>
                                                                <span className="fa fa-commenting m-r-5"></span> Chat with Seller
                                                            </Button>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Container>
                    }

                </section>
            </Fragment >
        )
    }
}

const mapStateToProps = ({ books = {}, auth = {} }) => {
    return {
        ...books,
        loggedIn: auth.authenticated,
        user: auth.user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getBooksBySearch: (data) => dispatch(BooksAction.getBooksBySearch(data)),
    deleteSelectedBook: (data) => dispatch(BooksAction.deleteBook(data)),
    createChat: (data) => dispatch(ChatAction.createChannel(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(BookListing)