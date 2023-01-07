import React, { Component } from 'react';
import { Button, ButtonToolbar, Container } from 'react-bootstrap';

import four from "../images/4.gif";
import seven from "../images/7.gif";

class About extends Component {
    render() {
        return (
            <section className="section-about text-center">
                <Container bsSize="large">
                    <div className="text">
                        <h1>Who are we</h1>
                        <p>
                            As the world is moving on the technology and everything
                            is relay’s on online booking online shopping even some
                            shops are move their setup on online systems we are
                            building that Website and Application. In our website
                            people can posted their book advertisement which they
                            want to sell out and the person who is need of that book
                            he can contact to that person by using our website and
                            application and make their deal and need.{" "}
                        </p>
                    </div>
                    <div className="info">
                        <img src={four} alt="fr" className="media" />
                    </div>
                    <div className="bio">
                        <h1>Why we</h1>
                        <p>
                            We are trying to dealing with all researchers, students
                            story lovers and the novel lovers we are providing all
                            in one place chooses yours field and contact to its
                            owner and make the deal and get your book. You can also
                            register yourself on our website by filling the form
                            also and we will keep you up to date to our new arrivals
                            or book relevant to your course subject or research.{" "}
                        </p>
                    </div>

                    <div className="we">
                        <img src={seven} alt="svn" className="media" />
                    </div>
                    <div className="us">
                        <h1>Importnace of Books</h1>
                        <p>
                            Books give plenty of joy to students, and they learn a
                            lot of things from books. They take them into a unique
                            world of imagination and improve their standard of
                            living. Books help to inspire students to do hard work
                            with courage and hope. They enrich the experience of
                            students and sharpen their intellect.
                        </p>
                    </div>
                </Container>


            </section>
        )
    }
}

export default About;