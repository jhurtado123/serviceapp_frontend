import React, {Component} from 'react';
import '../../assets/css/views/layouts/baseLayout.scss';

import hamburguerIcon from '../../assets/images/views/layouts/baseLayout/hamburguer-white.png';
import waveSidebar from '../../assets/images/views/layouts/baseLayout/wave-top-layout.png';
import closeIcon from '../../assets/images/views/layouts/baseLayout/close-white.png';
import Token from '../../assets/images/icons/coin.png';

import {Link} from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";
import {withSidebar} from "../../context/SidebarContext";
import {withAuth} from "../../context/AuthContext";
import Footer from "../../components/Footer";

class BaseLayout extends Component {

  render() {
    const {children, openMenu, closeMenu, isOpened, isLoggedIn, user} = this.props;
    return (
      <div className={'base-layout'}>
        <header>
          <img src={hamburguerIcon} alt="" onClick={openMenu} className={'open-menu'}/>
          <div className={''}>logo</div>
        </header>
        <div className={'sidebar ' + (isOpened && ' open')}>
          <div className={'sidebar-header'}>
            <div className={'close-sidebar'}>
              <img src={closeIcon} onClick={closeMenu}/>
              {isLoggedIn && <div className={'tokens'}>
                {user.wallet.tokens}<img src={Token}/>
              </div>}
            </div>
            {isLoggedIn &&
            <div className={'user-data'}>
              <ProfileImage user={user}/>
              <div className={'data'}>
                <p>{user.name}</p>
                <div className={'actions'}>
                  <Link to={''}>Editar perfil</Link>·
                  <Link to={'/logout'}>Logout</Link>
                </div>
              </div>
            </div>}
          </div>
          <div className={'sidebar-content'}>
            {isLoggedIn && <img src={waveSidebar} className={'wave-top'} alt=""/> }
            {!isLoggedIn &&
            <div className={'login-or-register'}>
              <Link to={'/login'}>Logueate</Link>
              <p>o</p>
              <Link to={'/register'}>Registrate</Link>
            </div> }
            {isLoggedIn &&
            <div className={'sidebar-links'}>
              <Link to={'/ads'}>Mis anuncios</Link>
              <Link to={'/appointments'}>Mis citas</Link>
              <Link to={'/chats'}>Mis chats</Link>
              <Link to={'/rewards'}>Progreso y premios</Link>
              <Link to={'/favorites'}>Mis favoritos</Link>
              <Link to={'/notifications'}>Notificaciones</Link>
              <Link to={'/ads/recover'}>Recuperar anuncios eliminados</Link>
              <Link to={'/buySerkens'}>Comprar Serkens</Link>
            </div>}
          </div>
        </div>
        {children}

        {isLoggedIn && <Footer/>}
        {isOpened && <div className={'backdrop'}/>}
      </div>
    );
  }
}

export default withAuth(withSidebar(BaseLayout));