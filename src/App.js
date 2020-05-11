import React from 'react';
import './assets/css/main.scss';
import {Route, Switch} from "react-router-dom";
import Login from "./views/Login";
import AuthProvider from "./context/AuthContext";
import AnonRoute from "./components/AnonRoute";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./views/Register";
import Logout from "./views/Logout";
import AdCreate from "./views/ad/AdCreate";
import AdEdit from "./views/ad/AdEdit";

import Profile from "./views/profile/Profile";
import ProfileEdit from "./views/profile/ProfileEdit";
import ProfileAds from "./views/profile/ProfileAds";
import RecoverAds from "./views/profile/RecoverAds";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Switch>
          <AnonRoute exact path={'/login'} component={Login}/>
          <PrivateRoute exact path={'/logout'} component={Logout}/>
          <AnonRoute exact path={'/register'} component={Register}/>
          <PrivateRoute exact path={'/ad/create'} component={AdCreate}/>
          <PrivateRoute exact path={'/ad/:id/edit'} component={AdEdit}/>
          <PrivateRoute exact path={'/ads'} component={ProfileAds}/>
          <PrivateRoute exact path={'/ads/recover'} component={RecoverAds}/>
          <PrivateRoute exact path={'/profile'} component={Profile}/>
          <PrivateRoute exact path={'/profile/edit'} component={ProfileEdit}/>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
