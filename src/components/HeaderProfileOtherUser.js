import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';
import ProfileImage from "./ProfileImage";


class HeaderProfile extends Component {

  render() {
    const { name, level, user, description } = this.props;
    return (
      <div className={'header-profile'}>
        <div className={'header-columns'}>
          <span className={'user-name'}>{name}</span>
        </div>
        <div className={'header-columns second-level'}>
          <div className={'coins'}>
            <span>Nivel {level}</span>
          </div>
          <div className={'img-profile'}>
            <ProfileImage user={user} />
          </div>
          <div>
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