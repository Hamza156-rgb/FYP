import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import AuthAction from "./AuthAction";

class FacebookComponent extends Component {

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

  facebookLogin = () => {
    const { facebookLogin } = this.props;
    facebookLogin();
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={{ pathname: redirect }} />
    }

    return (
      <Button
        className="ml-1"
        variant="primary"
        onClick={() => this.facebookLogin()}
      >
        <span className="fa fa-facebook"></span>
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
  facebookLogin: () => dispatch(AuthAction.facebookLogin())
})



export default connect(mapStateToProps, mapDispatchToProps)(FacebookComponent)
