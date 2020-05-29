import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';

class HeaderProfile extends Component {

  render() {
    const { name, level, url, description } = this.props;
    return (
      <div className={'header-profile'}>
        <div className={'header-columns'}>
          <span className={'user-name'}>{name}</span>
        </div>
        <div className={'header-columns second-level'}>
          <div className={'coins'}>
            <span>{level} </span>
            <span>nivel</span>
          </div>
          <div className="img-profile">
            <img className="avatar" src={url !== '' ? url : require('../assets/images/icons/avatar.png')} alt="avatar" />
          </div>
          <div className={'coins'}>
            <span></span>
          </div>
        </div>
        <div className={'center-columns'}>
          <div>
            {description}
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderProfile;