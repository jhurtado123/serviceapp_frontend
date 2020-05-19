import React,  { Component } from 'react';
import '../assets/css/views/profile/Notification.scss';
import chatIcon from "../assets/images/views/layouts/baseLayout/chat-purple.png";


class Notification extends Component {

  getYYYMMDDHHMMDate(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${
      (date.getMonth() + 1).toString().padStart(2, '0')}/${
      date.getDate().toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      (date.getHours() - 2).toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}`
  }

  render(){
    const { title, href, date } = this.props; 
    return(
      <div className={'notification'}>
        <img className={'notification-img'} src={chatIcon} alt="notification" />
        <div className={'notification-text-container'}>
          <p className={'notification-title'}>{title}</p>
          <div className={'notification-extra-info'}>
            <a href={`/chats/${href}`}>Click para verlo</a> <span className={'notification-date'}>{this.getYYYMMDDHHMMDate(date)}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Notification;