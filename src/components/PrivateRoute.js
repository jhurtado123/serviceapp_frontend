import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import {Redirect, Route} from "react-router-dom";
import Loading from "../views/Loading";

class PrivateRoute extends Component {
  render() {
    const {component: Comp, isLoggedIn, isLoading, ...rest} = this.props;
    return (
      isLoading ?
        (<Loading/>) :
          (<Route {...rest}
                  render={(props) =>
                    isLoggedIn ?
                      (<Comp {...props}/>) :
                      (<Redirect to={{
                        pathname: "/login",
                        state: {from: props.location},
                      }}/>)
                  }
          />)
    );
  }
}

export default withAuth(PrivateRoute);