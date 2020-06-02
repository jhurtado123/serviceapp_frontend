import React, {Component} from 'react';
import '../../assets/css/views/layouts/baseLayout.scss';

import hamburguerIcon from '../../assets/images/views/layouts/baseLayout/hamburguer-white.png';
import waveSidebar from '../../assets/images/views/layouts/baseLayout/wave-top-layout.png';
import closeIcon from '../../assets/images/views/layouts/baseLayout/close-white.png';
import Token from '../../assets/images/icons/coin.png';
import Logo from '../../assets/images/icons/logo_white.svg';

import {Link} from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";
import {withSidebar} from "../../context/SidebarContext";
import {withAuth} from "../../context/AuthContext";
import Footer from "../../components/Footer";
import io from 'socket.io-client';

let socket = undefined;


class BaseLayout extends Component {
  state = {
    notificationSocket: 0,
    notificationUser: 0,
    allNotifications: 0,
  };
  componentDidMount = () => {
    const { user } = this.props;
    if(user) {
      socket = io.connect(`${process.env.REACT_APP_BACKEND_URI}`, {query: `id=${user._id}`});
      this.setSocketEvents()
      this.getAllNotifications()
    }
  };

  setSocketEvents = () => {
    socket.on('notification:count', (data) => {
      this.setState({
        notificationSocket: data.value
      })
    });
  };

  getAllNotifications = () => {
    const { user } = this.props; 
    const { notificationSocket } = this.state; 
    let notificationsU = [];
    user.notifications.forEach(e => {
      if (e.isReaded === false) {
        notificationsU.push(e)
      }
    });
    let all = notificationsU.length + notificationSocket
    this.setState({
      allNotifications: all,
    })
  }

  componentWillUnmount() {
    this.props.closeMenu();
  }

  render() {
    const { allNotifications} = this.state;
    const {children, openMenu, closeMenu, isOpened, isLoggedIn, user} = this.props;
    return (
      <div className={'base-layout'}>
        <header>
          <img src={hamburguerIcon} alt="" onClick={openMenu} className={'open-menu'}/>
          <img className={'logo'} src={Logo} alt={'logo'}/>
        </header>
        <div className={'sidebar ' + (isOpened && ' open')}>
          <div className={'sidebar-header'}>
            <div className={'close-sidebar'}>
              <img src={closeIcon} onClick={closeMenu} alt="close" />
              {isLoggedIn && <div className={'tokens'}>
                {user.wallet.tokens}<img src={Token} alt="serken"/>
              </div>}
            </div>
            {isLoggedIn &&
            <div className={'user-data'}>
              <Link to={'/profile'}>
                <ProfileImage user={user} />
              </Link>
              <div className={'data'}>
                <Link to={'/profile'}>
                  <p>{user.name}</p>
                </Link>
                <div className={'actions'}>
                  <Link to={'/profile/edit'}>Editar perfil</Link>·
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
              <Link to={'/appointments'}>Mis citas</Link>
              <Link to={'/ads'}>Mis anuncios</Link>
              <Link to={'/chats'}>Mis chats</Link>
              <Link to={'/profile/rewards'}>Progreso y premios</Link>
              <Link to={'/favorites'}>Mis favoritos</Link>
              <Link to={'/profile/notifications'}>Notificaciones</Link>
              <Link to={'/buySerkens'}>Comprar Serkens</Link>
              {user.role.includes('ROLE_ADMIN') && <a className={'backoffice-link'} target={'_blank'} href={`${process.env.REACT_APP_BACKEND_URI}/admin`}>Backoffice</a>}
            </div>}
          </div>
        </div>
        {children}

        {isLoggedIn && <Footer notification={allNotifications} />}
        {isOpened && <div className={'backdrop'}/>}
      </div>
    );
  }
}

export default withAuth(withSidebar(BaseLayout));