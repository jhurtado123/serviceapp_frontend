import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import {Route, Redirect} from "react-router-dom";
import Loading from "../views/Loading";


class AnonRoute extends Component {
  render() {
    const {component : Comp, isLoggedIn, isLoading, ...rest} = this.props;
    return (
      isLoading ?
        <Loading/> :
      (<Route
        {...rest}
        render={(props) =>
          !isLoggedIn ? (
            <Comp {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          )
        }
      />)
    );
  }
}

export default withAuth(AnonRoute);