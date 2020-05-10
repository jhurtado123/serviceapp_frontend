import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';

class HeaderProfile extends Component {

  render(){
    const { name, level, missingpoints, tokens } = this.props;
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
          <div className="ImgProfile">
          <img className="Avatar" src={require('../assets/images/icons/avatar.png')} alt="avatar"/>
          </div>
          <div className="Gold">
            <span>{tokens} </span>
            <img className="ImgCoin" src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
        </div>
        <div className="CenterColumns Gold">
          <div></div>
          <div>
            Próxima recompensa: 50
            <img className="ImgCoin" src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
          <div>Faltan {missingpoints} puntos para subir al {level + 1} nivel</div>
        </div>
      </div>
    )
  }
}

export default HeaderProfile;