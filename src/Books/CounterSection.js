import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import CountUp from 'react-countup';

import "../Styles/css/main.css";
import "../Styles/css/font-awesome.min.css";
import "../Styles/css/main.css";

class CounterSection extends Component {
    render() {
        return (
            <React.Fragment>
                {/* <!-- Counter Section Start --> */}
                <section id="counter">
                    <div className="overlay">
                        <Container>
                            <Row>
                                <Col md={3} sm={6} xs={12}>
                                    <div className="counting wow fadeInDownQuick" data-wow-delay=".5s">
                                        <div className="icon">
                                            <span>
                                                <i className="lnr lnr-tag"></i>
                                            </span>
                                        </div>
                                        <div className="desc">
                                            <h3 className="counter">
                                                <CountUp start={0} delay={1} duration={2} end={100} /> +
                                            </h3>
                                            <p>Book Ads</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <div className="counting wow fadeInDownQuick" data-wow-delay="1s">
                                        <div className="icon">
                                            <span>
                                                <i className="lnr lnr-map"></i>
                                            </span>
                                        </div>
                                        <div className="desc">
                                            <h3 className="counter"><CountUp start={0} delay={1} duration={2} end={7} /> +</h3>
                                            <p>Categories</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <div className="counting wow fadeInDownQuick" data-wow-delay="1.5s">
                                        <div className="icon">
                                            <span>
                                                <i className="lnr lnr-users"></i>
                                            </span>
                                        </div>
                                        <div className="desc">
                                            <h3 className="counter"><CountUp start={0} delay={1} duration={2} end={2000} /> +</h3>
                                            <p>Reguler Members</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} sm={6} xs={12}>
                                    <div className="counting wow fadeInDownQuick" data-wow-delay="2s">
                                        <div className="icon">
                                            <span>
                                                <i className="lnr lnr-license"></i>
                                            </span>
                                        </div>
                                        <div className="desc">
                                            <h3 className="counter"><CountUp start={0} delay={1} duration={2} end={3} /> +</h3>
                                            <p>Languages</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </section>
                {/* <!-- Counter Section End --> */}

            </React.Fragment>

        );
    }
}

export default CounterSection;