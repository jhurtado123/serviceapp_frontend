import React, {Component} from 'react';
import {Link} from "react-router-dom";
import homeIcon from "../assets/images/views/layouts/baseLayout/home.png";
import appointmentsIcon from "../assets/images/views/layouts/baseLayout/appointments.png";
import addNewFooter from "../assets/images/views/layouts/baseLayout/footer-add.png";
import plusIcon from "../assets/images/views/layouts/baseLayout/plus.png";
import notificationsIcon from "../assets/images/views/layouts/baseLayout/notifications.png";
import chatIcon from "../assets/images/views/layouts/baseLayout/chat-purple.png";
import '../assets/css/components/footer.scss';

class Footer extends Component {

  state = {
    prevScrollpos: 0,
    visible: true,
  };

  handleScroll = () => {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const {visible} = this.state;
    return (
      <footer className={visible ? 'visible' : ''}>
        <div className={'group-icons'}>
          <Link to={''}>
            <img src={homeIcon} alt=""/>
          </Link>
          <Link to={'/appointments'}>
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
          <Link to={'/chats'}>
            <img src={chatIcon} alt=""/>
          </Link>
        </div>
      </footer>
    );
  }
}

export default Footer;