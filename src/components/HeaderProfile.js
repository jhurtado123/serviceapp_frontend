import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';
import {withAuth} from "../context/AuthContext";
import ProfileImage from "./ProfileImage";

class HeaderProfile extends Component {

  render(){
    const { name, level, url, missingpoints, tokens, user } = this.props;
    return (
      <div className="HeaderProfile">
        <div className="HeaderColumns">
          <span className="UserName">{name}</span>
        </div>
        <div className="HeaderColumns SecondLevel">
          <div className="Gold">
            <span>Nivel </span>
          <span>{level}</span>
          </div>
          <div className="img-profile">
          <ProfileImage user={user}/>
          </div>
          <div className="Gold">
            <span>{tokens} </span>
            <img className="ImgCoin" src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
        </div>
        <div className="CenterColumns Gold">
          <div>
            Próxima recompensa: 50
            <img className="ImgCoin" src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
          <div>Faltan {missingpoints} puntos para subir al nivel {level + 1}</div>
        </div>
      </div>
    )
  }
}

export default withAuth(HeaderProfile);