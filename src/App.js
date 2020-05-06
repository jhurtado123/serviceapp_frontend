import React from 'react';
import './assets/css/main.scss';
import {Route, Switch} from "react-router-dom";
import Login from "./views/Login";
import AuthProvider from "./context/AuthContext";
import AnonRoute from "./Components/AnonRoute";
import PrivateRoute from "./Components/PrivateRoute";
import Register from "./views/Register";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Switch>
          <AnonRoute exact path={'/login'} component={Login}/>
          <AnonRoute exact path={'/register'} component={Register}/>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
