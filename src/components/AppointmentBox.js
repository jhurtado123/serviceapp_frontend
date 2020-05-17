import React, {Component} from 'react';
import ProfileImage from "./ProfileImage";
import '../assets/css/components/appointmentBox.scss';
import ClockIcon from '../assets/images/icons/clock-purple.png';
import {Link} from "react-router-dom";


class AppointmentBox extends Component {

  getYYYMMDDHHMMDate(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${
      (date.getMonth()+1).toString().padStart(2, '0')}/${
      date.getDate().toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      (date.getHours()-2).toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}`
  }

  render() {
    const {appointment, user} = this.props;
    return (
      <Link to={`/appointments/${appointment._id}`} className={'appointment-row'}>
        <ProfileImage user={user}/>
        <div className={'data'}>
          <div className={'ad-title'}>{appointment.ad.name}</div>
          <div className={'appointment-date'}>
            <img src={ClockIcon} alt=""/>{this.getYYYMMDDHHMMDate(appointment.date)}
          </div>
        </div>
      </Link>
    );
  }
}

export default AppointmentBox;