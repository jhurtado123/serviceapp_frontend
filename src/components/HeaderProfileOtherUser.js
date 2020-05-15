import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';

class HeaderProfile extends Component {

  render() {
    const { name, level, url, description } = this.props;
    return (
      <div className="HeaderProfile">
        <div className="HeaderColumns">
          <img className="ImgHeader" src={require('../assets/images/icons/menu.png')} alt="menu" />
          <span className="UserName">{name}</span>
          <img className="ImgHeader" src={require('../assets/images/icons/notifications.png')} alt="notifications"></img>
        </div>
        <div className="HeaderColumns SecondLevel">
          <div className="Gold">
            <span>{level} </span>
            <span>nivel</span>
          </div>
          <div className="img-profile">
            <img className="avatar" src={url !== '' ? url : require('../assets/images/icons/avatar.png')} alt="avatar" />
          </div>
          <div className="Gold">
            <span></span>
          </div>
        </div>
        <div className="CenterColumns Gold">
          <div>
            {description}
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderProfile;