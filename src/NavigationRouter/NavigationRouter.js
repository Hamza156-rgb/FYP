import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container, Row, Form, FormControl, Button, Col, Badge } from 'react-bootstrap';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

import AuthAction from '../Auth/AuthAction';

import About from '../Component/About';
import Home from '../Books/Home';
import UserBooks from '../Books/UserBooks';
import AddBookPost from '../Books/AdBookPost';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import ChatApp from '../Chat/Chat';
import User from '../User/User';
import Contact from '../Contact/Contact';

import MessageLink from './Message';

import logo from "../images/logo-2.png";
import userImage from "../images/user-image.png";

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css"
import "./Router.css";

class NavigationRouter extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
    }

    UNSAFE_componentWillUpdate(newProps, old) {
    }

    signout = () => {
        const { signout } = this.props;
        signout();
    }


    getHeader = () => {

        const { channels, channel_loading, authenticated, user } = this.props;

        return <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect={true} >
                <Container>
                    <Link to="/" className="navbar-brand"><img src={logo} alt="img" /></Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to={"/"} className="nav-link">
                                Home
                            </Link>
                            <Link to={"/ads"} className="nav-link">
                                Ads
                            </Link>
                            {authenticated && (channels || !channel_loading) && <MessageLink channels={channels} />}
                            <Link to={"/about"} className="nav-link">
                                About
                            </Link>
                            <Link to={"/contact"} className="nav-link">
                                Contact Us
                            </Link>
                        </Nav>
                        <Nav>
                            {!authenticated && <Link to={"/login"} className="nav-link">
                                <Button variant="success" size={'sm'}><span className="fa fa-sign-in"></span> Login</Button>
                            </Link>}
                            {!authenticated && <Link to={"/signup"} className="nav-link">
                                <Button variant="warning" size={'sm'}><span className="fa fa-user"></span> Sign Up</Button>
                            </Link>}

                            {!authenticated && <Link to={"/signup"} className="nav-link">
                                <Button variant="danger" size={'sm'}><span className="fa fa-plus-circle"></span> Post an Ad</Button>
                            </Link>}

                            {authenticated && <Link to={"/ads/add"} className="nav-link">
                                <Button variant="danger" size={'sm'}><span className="fa fa-plus-circle"></span> Post an Ad</Button>
                            </Link>}

                            {authenticated && user &&
                                <NavDropdown title={
                                    <div className={'d-inline'}>
                                        <img
                                            width="30px"
                                            src={user.photoURL || userImage}
                                            style={{ margin: '0 10px' }} />
                                        {user.displayName || user.email}
                                    </div>
                                } id="basic-nav-dropdown">
                                    <Link to={"/profile"} className="dropdown-item">
                                        <span className="fa fa-user"></span> Profile
                                    </Link>
                                    <Link to={"/my-ads"} className="dropdown-item">
                                        <span className="fa fa-book"></span> Ads Posted
                                    </Link>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="" onClick={() => this.signout()}><span className="fa fa-sign-out"></span> LogOut</NavDropdown.Item>
                                </NavDropdown>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>

    }

    getFooter = () => {
        const { authenticated } = this.props;

        return <footer>
            {/* <!-- Footer Area Start --> */}
            <section className="footer-Content">
                <Container>
                    <Row>
                        <Col md={4} sm={6} xs={12}>
                            <div className="widget">
                                <h3 className="block-title">About us</h3>
                                <div className="textwidget">
                                    <p>Online old book shop come and find the book which you want and meet with the sellar</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <div className="widget">
                                <h3 className="block-title">Useful Links</h3>
                                <ul className="menu">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/ads">Ads</Link></li>
                                    <li><Link to="/about">About</Link></li>
                                    {authenticated && <li><Link to="/profile">Profile</Link></li>}
                                    {!authenticated && <li><Link to="/signup">Post Ad</Link></li>}
                                    <li><Link to="/contact">Contact Us</Link></li>

                                    {authenticated && <li><Link to="/ads/add">Post Ad</Link></li>}

                                    {!authenticated && <li><Link to="/signup">Sign Up</Link></li>}
                                    {!authenticated && <li><Link to="/login">Login</Link></li>}
                                    <li><a target="_blank" href="https://hamzawaseemweb.000webhostapp.com/" >About Developer</a></li>
                               
                                </ul>
                            </div>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <div className="widget">

                                <h3 className="block-title">Address</h3>
                                <div className="twitter-content clearfix">
                                    <ul className="twitter-list">
                                        <li className="clearfix">
                                            <span className="fa fa-map-marker"></span>
                                            <span className="m-l-5 text">
                                                21 B Railway Officer colony Walton Road Lahore cantt.
                                            </span>
                                        </li>
                                        <li className="clearfix">
                                            <span className="fa fa-phone"></span>
                                            <span className="m-l-5 text">
                                                +92-000-0000000
                                            </span>
                                        </li>
                                        <li className="clearfix">
                                            <span className="fa fa-map-marker"></span>
                                            <span className="m-l-5 text">
                                                onlineoldbook123@gmail.com
                                            </span>
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>
            {/* <!-- Footer area End --> */}

            {/* <!-- Copyright Start  --> */}
            <div id="copyright">
                <Container>
                    <Row>
                        <div className="col-md-12">
                            <div className="site-info pull-left">
                                <p>OLD BOOKS SHOP | All copyrights reserved @ 2022</p>
                            </div>
                            <div className="bottom-social-icons social-icon pull-right">
                                <a className="facebook" target="_blank" href="https://web.facebook.com/"><i className="fa fa-facebook"></i></a>
                                <a className="twitter" target="_blank" href="https://twitter.com/"><i className="fa fa-twitter"></i></a>
                                <a className="youtube" target="_blank" href="https://youtube.com"><i className="fa fa-youtube"></i></a>
                                <a className="linkedin" target="_blank" href="https://www.linkedin.com/"><i className="fa fa-linkedin"></i></a>
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
            {/* <!-- Copyright End --> */}

        </footer>
    }


    getRoutes = () => {
        const { authenticated, user } = this.props;

        return <Switch>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />

            <PublicRoute path="/login" authenticated={authenticated} component={SignIn} />
            <PublicRoute path="/signup" authenticated={authenticated} component={SignUp} />

            <PrivateRoute path="/profile" authenticated={authenticated} component={User} />
            <PrivateRoute path="/my-ads" authenticated={authenticated} component={UserBooks} />

            <PrivateRoute exact={true} path="/ads/add" authenticated={authenticated} component={props => <AddBookPost {...props} />} />
            <PrivateRoute path="/ads/:id" authenticated={authenticated} component={props => <AddBookPost {...props} />} />

            <PrivateRoute path="/messages" authenticated={authenticated} component={ChatApp} />

            <Route path="/" component={Home} />
        </Switch>;
    }

    render() {
        return (
            <Fragment>
                < Router >
                    <div>
                        {this.getHeader()}
                        {this.getRoutes()}
                        {this.getFooter()}
                    </div>
                </Router >
            </Fragment>
        )
    };
}

const mapStateToProps = ({ auth = {}, chat }) => {

    return {
        ...auth,
        channels: chat.channels,
        channel_loading: chat.loading,
    }
}

const mapDispatchToProps = (dispatch) => ({
    signout: () => dispatch(AuthAction.signout())
})

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
