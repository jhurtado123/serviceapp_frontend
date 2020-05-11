import React, {Component} from 'react';
import BottomWave from "../../assets/images/views/login/wave-login-bottom.png";
import {Link} from "react-router-dom";
import '../../assets/css/views/errorPages.scss';

class Error401 extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={'container error-page'}>
          <h1>No estás autorizado para hacer eso.</h1>
          <Link to={'/login'} className={'button-bck-purple'}>Ir al login</Link>
        </div>
        <img className={'wave-bottom'} src={BottomWave}/>
      </React.Fragment>
    );
  }
}

export default Error401;