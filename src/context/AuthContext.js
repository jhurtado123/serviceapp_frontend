import React, {Component} from 'react';
import authApiClient from "../services/apiManager/auth";

export const AuthContext = React.createContext();

export const withAuth = (Comp) => {
  return class WithAuth extends Component {
    render() {
      return (
        <AuthContext.Consumer>
          {({ user, isLoggedIn, handleLogin, handleLogout }) => {
            return (
              <Comp
                onLogin={handleLogin}
                user={user}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                {...this.props}
              />
            );
          }}
        </AuthContext.Consumer>
      );
    }
  };
};

class AuthProvider extends Component {

  state = {
    isLoggedIn: false,
    user: null,
    isLoading: true,
  };

  handleLogin = ({username, password}) => {
    authApiClient.login({username, password})
      .then(({data: user}) => {
        this.setState({
          isLoggedIn: true,
          user,
        });
      })
      .catch(error => {
        this.setState({
          isLoggedIn: false,
          user: null,
        });
      })
  };

  handleLogout = () => {
    authApiClient
      .logout()
      .then(() => {
        this.setState({
          isLoggedIn: false,
          user: null,
        });
      })
      .catch((error) => {
        //
      });
  };

  componentDidMount() {
    authApiClient
      .whoami()
      .then((user) => {
        this.setState({
          isLoading: false,
          isLoggedIn: true,
          user,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          isLoggedIn: false,
          user: null,
        });
      });
  }

  render() {
    const {children} = this.props;
    const {isLoggedIn, user} = this.state;
    return (
      <AuthContext.Provider value={{
        isLoggedIn,
        user,
        handleLogin: this.handleLogin,
        handleLogout: this.handleLogout,
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;