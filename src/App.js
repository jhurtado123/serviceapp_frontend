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
import ProfileNotifications from "./views/profile/ProfileNotifications";
import ProfileOtherUser from "./views/profile/ProfileOtherUser";
import ProfileAds from "./views/profile/ProfileAds";
import Rewards from "./views/profile/Rewards";
import RecoverAds from "./views/profile/RecoverAds";
import AdView from "./views/ad/AdView";
import Error401 from "./views/error/Error401";
import Error404 from "./views/error/Error404";
import Error500 from "./views/error/Error500";
import SidebarProvider from "./context/SidebarContext";
import Home from "./views/Home";
import Search from "./views/Search";
import Chat from "./views/chat/Chat";
import Chats from "./views/chat/Chats";
import Appointments from "./views/appointments/Appointments";
import Appointment from "./views/appointments/Appointment";
import BuyTokens from "./views/BuyTokens";
import Favorites from "./views/profile/Favorites";

function App() {
  return (
    <SidebarProvider>
      <AuthProvider>
        <div className="App">
          <Switch>
            <AnonRoute exact path={'/login'} component={Login}/>
            <PrivateRoute exact path={'/logout'} component={Logout}/>
            <AnonRoute exact path={'/register'} component={Register}/>
            <PrivateRoute exact path={'/ad/create'} component={AdCreate}/>
            <PrivateRoute exact path={'/ad/:id/edit'} component={AdEdit}/>
            <PrivateRoute exact path={'/ad/:id'} component={AdView}/>
            <PrivateRoute exact path={'/ads'} component={ProfileAds}/>
            <PrivateRoute exact path={'/ads/recover'} component={RecoverAds}/>
            <PrivateRoute exact path={'/profile'} component={Profile}/>

            <PrivateRoute exact path={'/favorites'} component={Favorites}/>

            <PrivateRoute exact path={'/profile/edit'} component={ProfileEdit}/>
            <PrivateRoute exact path={'/profile/user/:username'} component={ProfileOtherUser}/>     
            <PrivateRoute exact path={'/profile/notifications'} component={ProfileNotifications}/>

            <PrivateRoute exact path={'/profile/rewards'} component={Rewards}/>
            <PrivateRoute exact path={'/profile/user/:username'} component={ProfileOtherUser}/>

            <PrivateRoute exact path={'/appointments'} component={Appointments}/>
            <PrivateRoute exact path={'/appointments/:id'} component={Appointment}/>

            <PrivateRoute exact path={'/chats'} component={Chats} />
            <PrivateRoute exact path={'/chats/:id'} component={Chat} />

            <PrivateRoute exact path={'/buySerkens'} component={BuyTokens} />

            <Route exact path={'/401'} component={Error401}/>
            <Route exact path={'/404'} component={Error404}/>
            <Route exact path={'/500'} component={Error500}/>

            <Route exact path={'/'} component={Home}/>
            <Route exact path={'/search'} component={Search}/>
          </Switch>
        </div>
      </AuthProvider>
    </SidebarProvider>
  );
}

export default App;
