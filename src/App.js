import React from 'react';
import './assets/css/main.scss';
import {Route, Switch} from "react-router-dom";
import Login from "./views/Login";
import AuthProvider from "./context/AuthContext";
import AnonRoute from "./Components/AnonRoute";
import PrivateRoute from "./Components/PrivateRoute";
import Logout from "./views/Logout";
import Profile from "./views/Profile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Switch>
          <AnonRoute exact path={'/login'} component={Login}/>
          <PrivateRoute exact path={'/logout'} component={Logout}/>
          <PrivateRoute exact path={'/profile'} component={Profile}/>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
