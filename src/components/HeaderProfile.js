import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';
import {withAuth} from "../context/AuthContext";
import ProfileImage from "./ProfileImage";

class HeaderProfile extends Component {

  render(){
    const { name, level, missingpoints, tokens, user } = this.props;
    return (
      <div className={'header-profile'}>
        <div className={'header-columns'}>
          <span className={'user-name'}>{name}</span>
        </div>
        <div className={'header-columns second-level'}>
          <div className={'coins'}>
            <span>Nivel {level}</span>
          </div>
          <div className="img-profile">
          <ProfileImage user={user}/>
          </div>
          <div className={'coins'}>
            <span>{tokens} </span>
            <img className={'img-coin'} src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
        </div>
        <div className={'center-columns'}>
          <div className={'coins'}>
            Próxima recompensa: 50
            <img className={'img-coin'} src={require('../assets/images/icons/coin.png')} alt="coin" />
          </div>
          <div>Faltan {missingpoints} puntos para subir al nivel {level + 1}</div>
        </div>
      </div>
    )
  }
}

export default withAuth(HeaderProfile);