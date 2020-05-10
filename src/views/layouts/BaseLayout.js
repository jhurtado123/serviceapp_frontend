import React, {Component} from 'react';
import '../../assets/css/views/layouts/baseLayout.scss';
import plusIcon from '../../assets/images/views/layouts/baseLayout/plus.png';
import addNewFooter from '../../assets/images/views/layouts/baseLayout/footer-add.png';
import appointmentsIcon from '../../assets/images/views/layouts/baseLayout/appointments.png';
import chatIcon from '../../assets/images/views/layouts/baseLayout/chat-purple.png';
import homeIcon from '../../assets/images/views/layouts/baseLayout/home.png';
import notificationsIcon from '../../assets/images/views/layouts/baseLayout/notifications.png';
import hamburguerIcon from '../../assets/images/views/layouts/baseLayout/hamburguer-white.png';
import waveSidebar from '../../assets/images/views/layouts/baseLayout/wave-top-layout.png';
import closeIcon from '../../assets/images/views/layouts/baseLayout/close-white.png';
import Token from '../../assets/images/icons/coin.png';

import {Link} from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";
import {withSidebar} from "../../context/SidebarContext";
import {withAuth} from "../../context/AuthContext";

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
                10<img src={Token}/>
              </div>}
            </div>
            {isLoggedIn &&
            <div className={'user-data'}>
              <ProfileImage/>
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
            {isLoggedIn && <div>Logged  bro</div>}
          </div>
        </div>
        {children}

        {isLoggedIn && <footer>
          <div className={'group-icons'}>
            <Link to={''}>
              <img src={homeIcon} alt=""/>
            </Link>
            <Link to={''}>
              <img src={appointmentsIcon} alt=""/>
            </Link>
          </div>
          <Link to={'/ad/create'} className={'footer-add-new'}>
            <img src={addNewFooter}/>
            <img src={plusIcon} className={'plus-icon'}/>
          </Link>
          <div className={'group-icons'}>
            <Link to={''}>
              <img src={notificationsIcon} alt=""/>
            </Link>
            <Link to={''}>
              <img src={chatIcon} alt=""/>
            </Link>
          </div>
        </footer>}
        {isOpened && <div className={'backdrop'}/>}
      </div>
    );
  }
}

export default withAuth(withSidebar(BaseLayout));