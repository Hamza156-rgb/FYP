import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col, Row, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import BooksAction from './BooksAction';

import BookListing from './Listing';
import FeaturedListing from './FeaturedListing';
import CounterSection from './CounterSection';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css";
import "../Styles/fonts/line-icons/line-icons.css";
import { Categories, Languages } from '../Config/configuration';
import Helper from '../Services/Helper';

class Home extends Component {

    // props: {
    //     user: Object
    // };

    // state: {};

    constructor(props) {
        super(props);
        this.state = {
            redirect: '',
            category: "",
            language: "",
            keyword: "",
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
        /* check for past link if authenticated and link found redirect user to that link */
        if(newProps.authenticated &&  newProps.location?.state?.from ){
            this.props.history.push(newProps.location.state.from);
        }
    }

    getBooksBySearch = () => {
        console.log(this.state)
        const { category,
            language,
            keyword } = this.state;

        const { getBooksBySearch } = this.props;
        getBooksBySearch({
            category,
            language,
            keyword
        });

        const { location } = this.props;

        if (location.pathname !== '/ads') {
            this.props.history.push('/ads');
        }

    }

    render() {

        const { location } = this.props;
        const { redirect } = this.state;

        const search_minimize = location.pathname === '/ads';

        return (
            <div>
                <section id={search_minimize ? "intro-listing" : "intro"} className="section-intro">
                    <div className="overlay">
                        <Container>
                            <div className="main-text">
                                <h1 className="intro-title">Welcome To <span style={{ color: "#3498DB" }}>OLD BOOKS SHOP</span></h1>
                                <p className="sub-title">Buy and sell every kind of books from used to new or, search for any kind of book and more</p>
                                {/* <!-- Start Search box --> */}
                                <Form className="search-form" method="get">
                                    <Row className="search-bar">
                                        <Col xs={12} sm={6} md={6} lg={3} className="search-col">
                                            <Form.Select size="md" aria-label="Default select example"
                                                onChange={(e) =>
                                                    this.setState({
                                                        category: e.target.value,
                                                    })
                                                }
                                                value={this.state.category}
                                            >
                                                <option value="">All Categories</option>
                                                {Categories.map((item, index) =>
                                                    <option key={index} value={item}>{Helper.capitalize(item)}</option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={3} className="search-col">
                                            <Form.Select size="md" aria-label="Default select example"
                                                onChange={(e) =>
                                                    this.setState({
                                                        language: e.target.value,
                                                    })
                                                }
                                                value={this.state.language}
                                            >
                                                <option value="">All Languages</option>
                                                {Languages.map((item, index) =>
                                                    <option key={index} value={item}>{Helper.capitalize(item)}</option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={3} className="search-col">
                                            <InputGroup size="md">
                                                <InputGroup.Text id="btnGroupAddon"> <span className="fa fa-search"></span></InputGroup.Text>
                                                <Form.Control
                                                    size="md"
                                                    type="search"
                                                    placeholder="Enter Keyword"
                                                    className="mr-2"
                                                    aria-label="Search"
                                                    onChange={(e) =>
                                                        this.setState({
                                                            keyword: e.target.value,
                                                        })
                                                    }
                                                    value={this.state.keyword}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={3} className="search-col">
                                            <div className="d-grid gap-2">
                                                <Button onClick={() => this.getBooksBySearch()} variant="primary" size="md">Search</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                                {/* <!-- End Search box --> */}
                            </div>
                        </Container>
                    </div>
                </section>

                {redirect && <Redirect to={{ pathname: redirect }} />
                }

                <Switch >
                    <Route exact path="/ads" render={() => <BookListing {...this.state} />} />
                    <Route exact path="/" render={() =>
                        <Fragment>
                            <FeaturedListing />
                            <CounterSection />
                        </Fragment>
                    } />
                </Switch>

                {this.props.children}

            </div>

        )
    }
}


const mapStateToProps = ({ auth = {}, }) => {
    return {
        ...auth,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getBooksBySearch: (data) => dispatch(BooksAction.getBooksBySearch(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))