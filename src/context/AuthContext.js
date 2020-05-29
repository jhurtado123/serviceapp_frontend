import React, {Component} from 'react';
import authApiClient from "../services/apiManager/auth";
import LoadingBars from "../components/LoadingBars";

export const AuthContext = React.createContext();

export const withAuth = (Comp) => {
  return class WithAuth extends Component {
    render() {
      return (
        <AuthContext.Consumer>
          {({ user, isLoggedIn, handleLogin, handleLogout, isLoading, hasError, errorMessage, handleRegister }) => {
            return (
              <React.Fragment>
              {!isLoading ? <Comp
                onLogin={handleLogin}
                user={user}
                hasError={hasError}
                errorMessage={errorMessage}
                isLoading={isLoading}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onRegister={handleRegister}
                {...this.props}
              /> : <LoadingBars/>}
              </React.Fragment>
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
    hasError:false,
    errorMessage: undefined,
  };

  handleLogin = ({username, password}) => {
    authApiClient.login({username, password})
      .then(({data: user}) => {
        this.setState({
          isLoggedIn: true,
          user,
          isLoading:false,
          hasError: false,
          errorMessage: undefined,
        });
      })
      .catch(({response: { data: {data : errorMessage}}}) => {
        this.setState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          hasError: true,
          errorMessage,
        });
      })
  };

  handleRegister = (user) => {
    this.setState({
      isLoggedIn: true,
      user,
      isLoading:false,
      hasError: false,
      errorMessage: undefined,
    });
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

  async componentDidMount() {
    await authApiClient
      .whoami()
      .then(({data: user}) => {
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
    const {isLoggedIn, user, isLoading, hasError, errorMessage} = this.state;
    return (
      <AuthContext.Provider value={{
        isLoggedIn,
        isLoading,
        user,
        hasError,
        handleRegister: this.handleRegister,
        errorMessage,
        handleLogin: this.handleLogin,
        handleLogout: this.handleLogout,
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;