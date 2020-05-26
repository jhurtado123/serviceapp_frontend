import React, {Component} from 'react';
import BottomWave from "../../assets/images/views/login/wave-login-bottom.png";
import {Link} from "react-router-dom";
import '../../assets/css/views/errorPages.scss';

class Error404 extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={'container error-page'}>
          <h1>Algo ha ido mal, prueba de nuevo más tarde</h1>
          <Link to={'/'} className={'button-bck-purple'}>Ir a la home</Link>
        </div>
        <img className={'wave-bottom'} src={BottomWave} alt={'wave-bottom'} />
      </React.Fragment>
    );
  }
}

export default Error404;