import React, { Component } from 'react';
import '../assets/css/components/HeaderProfile.scss';

class HeaderProfile extends Component {
  render(){
    const { name, level, tokens } = this.props;
    return (
      <div className="HeaderProfile">
        <div className="HeaderColumns">
          <img className="ImgHeader" src={require('../assets/images/icons/menu.png')} alt="menu"></img>
          <span>{name}</span>
          <img className="ImgHeader" src={require('../assets/images/icons/notifications.png')} alt="notifications"></img>
        </div>
        <div className="HeaderColumns SecondLevel">
          <div className="Gold">
          <span>{level} </span>
          <span>nivel</span>
          </div>
          <div className="ImgProfile">
            <img className="Avatar" src={require('../assets/images/icons/avatar.png')} alt="avatar"></img>
          </div>
          <div className="Gold">
            <span>{tokens} </span>
            <img className="ImgCoin" src={require('../assets/images/icons/coin.png')} alt="coin"></img>
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderProfile;