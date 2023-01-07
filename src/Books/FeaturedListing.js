import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom'
import { Container, Col, Row, Badge, Spinner, Button } from 'react-bootstrap';
import Moment from 'react-moment';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css";

import BooksAction from './BooksAction';
import ChatAction from '../Chat/ChatAction';

class FeaturedListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
        }
    }

    componentDidMount() {
        const { getFeatured } = this.props;
        getFeatured();
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
    }

    createChat = (user) => {
        const { createChat } = this.props;
        createChat({ user });
        this.setState({
            redirect: '/messages'
        });
    }

    render() {
        const { featuredBooks, loggedIn } = this.props;
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to={{ pathname: redirect }} />
        }

        return (
            <React.Fragment>
                <section className="featured-lis book-listing">
                    <Container id="new-products">
                        <Row>
                            <h3 className="section-title">Featured Listings</h3>

                            {featuredBooks && featuredBooks.map((book, index) =>
                                <Col md={12} lg={6} key={'book' + index} id={'book' + index}>
                                    <div className="item">
                                        <div className="product-item d-flex flex-column flex-sm-column flex-md-row flex-lg-row">
                                            <div className="carousel-thumb">
                                                <img src={book.image} alt="" />
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

                                                {book.postedAt && <div className="time mb-1">
                                                    <span className="fa fa-clock-o"></span>
                                                    <span className="m-l-5 text"><Moment fromNow>{new Date(book.postedAt.seconds * 1000)}</Moment> </span>
                                                </div>}

                                                <div className="seller-info">

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

                                                    {loggedIn && <div className="phone">
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
                </section>

            </React.Fragment>

        );
    }
}

const mapStateToProps = ({ books = {}, auth = {} }) => {
    return {
        featuredBooks: books.featuredBooks,
        loggedIn: auth.authenticated,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getFeatured: () => dispatch(BooksAction.getFeaturedBooks()),
    createChat: (data) => dispatch(ChatAction.createChannel(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(FeaturedListing)