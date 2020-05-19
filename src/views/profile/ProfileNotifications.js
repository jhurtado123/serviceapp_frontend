import React, { Component } from 'react';
import { withAuth } from "../../context/AuthContext";
import HeaderWithTitle from "../../components/HeaderWithTitle";
import Notification from "../../components/Notification";
import SearchBar from "../../components/SearchBar";
import profileApiClient from "../../services/apiManager/profile";
import REDIRECT from "../../errorRedirects";


class ProfileNotifications extends Component {
  state = {
    notifications: [],
  }

  componentDidMount = () => {
    this.getProfile()
  }

  async getProfile () {
    try {
      const { data } = await profileApiClient
        .getProfile()
      this.setState({
        notifications: data.notifications, 
      })  
      }
    catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    };
  }

  displayNotifications = () => {
    const { notifications } = this.state;
    return notifications.map((notification, i) => {
      return <Notification key={i} title={notification.title} href={notification.href} date={notification.createdAt} />
    })
  }
  render () {
    return (
      <div>
        <HeaderWithTitle title="Notifications" />
        <SearchBar />
        <div className={'notifications-container'}>
          {this.displayNotifications()}
        </div>
      </div>
    )
  }
}


export default withAuth(ProfileNotifications);