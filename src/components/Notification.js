import React, {Component} from 'react';
import '../assets/css/views/profile/Notification.scss';
import chatIcon from "../assets/images/views/layouts/baseLayout/chat-purple.png";
import AppointmentIcon from "../assets/images/icons/appointment-icon.png"
import {Link} from "react-router-dom";
import reward from "../assets/images/icons/reward.png";


class Notification extends Component {

  getYYYMMDDHHMMDate(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${
      date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      (date.getHours()).toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}`
  }

  displayImage = () => {
    const {type} = this.props;
    switch (type) {
      case 'chat':
        return <img className={'notification-img'} src={chatIcon} alt="notification"/>
      case 'appointment-finished':
        return <img className={'notification-img'} src={AppointmentIcon} alt="notification"/>;
      case 'reward':
        return <img className={'notification-img'} src={reward} alt="notification" />
      default:
        break;
    }
  };

  getlinkText = () => {
    const {type} = this.props;
    switch (type) {
      case 'chat':
        return 'Click para verlo';
      case 'reward':
        return 'Click para verlo';
      case 'appointment-finished':
        return 'Click para valorar';
      default:
        break;
    }
  };

  handleOpenModal = (e) => {
    e.preventDefault();
    const {showModal} = this.props;
    showModal(e.target.getAttribute('data-id'));
  };

  render() {
    const {title, href, date, isReaded, type} = this.props;
    return (
      <div className={'notification'}>
        {this.displayImage()}
        <div className={'notification-text-container ' + (isReaded ? 'notification-readed ' : '')}>
          <p className={'notification-title'}>{title}</p>
          <div className={'notification-extra-info'}>
            {type === 'appointment-finished' ?
              <React.Fragment>
                <Link to={'#'} data-id={href} onClick={this.handleOpenModal}>{this.getlinkText()}</Link>
                <span className={'notification-date'}>{this.getYYYMMDDHHMMDate(date)}</span>
              </React.Fragment>
              :
              <React.Fragment>
                <Link to={`${href}`}>{this.getlinkText()}</Link>
                <span className={'notification-date'}>{this.getYYYMMDDHHMMDate(date)}</span>
              </React.Fragment>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Notification;