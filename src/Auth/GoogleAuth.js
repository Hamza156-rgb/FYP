import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import AuthAction from "./AuthAction";

class GoogleComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: '',
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

  googleLogin = () => {
    const { googleLogin } = this.props;
    googleLogin();
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={{ pathname: redirect }} />
    }

    return (

      <Button
        variant="danger"
        onClick={() => this.googleLogin()}
      >
        <span className="fa fa-google"></span>
      </Button>

    );
  }
}

const mapStateToProps = ({ auth = {}, }) => {
  return {
    ...auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  googleLogin: () => dispatch(AuthAction.googleLogin())
})



export default connect(mapStateToProps, mapDispatchToProps)(GoogleComponent)
