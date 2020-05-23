import React,  { Component } from 'react';
import '../assets/css/views/profile/Notification.scss';
import chatIcon from "../assets/images/views/layouts/baseLayout/chat-purple.png";
import reward from "../assets/images/icons/reward.png";


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

  displayImage = () => {
    const { type } = this.props;
    switch (type) {
      case 'chat':
        return <img className={'notification-img'} src={chatIcon} alt="notification" />
        case 'reward':
        return <img className={'notification-img'} src={reward} alt="notification" />
      default:
        break;
    }
  }
  render(){
    const { title, href, date, isReaded } = this.props; 
    return(
      <div className={'notification'}>
        {this.displayImage()}
        {isReaded ? 
          <div className={'notification-text-container notification-readed'}>
            <p className={'notification-title'}>{title}</p>
            <div className={'notification-extra-info'}>
              <a href={`/${href}`}>Click para verlo</a> <span className={'notification-date'}>{this.getYYYMMDDHHMMDate(date)}</span>
            </div>
          </div> : 
          <div className={'notification-text-container'}>
            <p className={'notification-title'}>{title}</p>
            <div className={'notification-extra-info'}>
              <a href={`/${href}`}>Click para verlo</a> <span className={'notification-date'}>{this.getYYYMMDDHHMMDate(date)}</span>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Notification;