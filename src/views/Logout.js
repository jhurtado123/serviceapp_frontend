import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import {Redirect} from "react-router-dom";


class Logout extends Component {
  render() {
    return (
      <div>
        {this.props.onLogout()}
        <Redirect to={{
          pathname: "/",
          state: {from: this.props.location},
        }}/>
      </div>
    );
  }
}

export default withAuth(Logout);