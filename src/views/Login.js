import React, {Component} from 'react';
import BottomWave from '../assets/images/views/login/wave-login-bottom.png'
import '../assets/css/views/login/login.scss';
import InputWithIcon from "../components/InputWithIcon";
import {Link} from "react-router-dom";
import {withAuth} from "../context/AuthContext";
import Logo from '../assets/images/icons/logo_purple.svg';


class Login extends Component {

  state = {
    username: '',
    password: '',
    formError: undefined,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      formError: undefined,
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {onLogin} = this.props;
    const {username, password} = this.state;
    if ((!username || !password) ) {
      this.setState({
        formError: 'Rellena los campos antes de continuar',
      });
      return false;
    } else {
      onLogin(this.state);
    }
  };

  render() {
    const {username, password, formError} = this.state;
    const {hasError, errorMessage} = this.props;
    return (
      <div className={'login'}>
        <img className={'logo'} src={Logo} alt={'logo'}/>
        <form method={'post'} onSubmit={this.handleSubmit}>
          <InputWithIcon icon={'user-purple'} name={'username'} placeholder={'Tu username'} value={username} type={'text'}
                        handleChange={this.handleChange}/>
          <InputWithIcon icon={'lock-purple'} name={'password'} placeholder={'Tu contraseña'} value={password} type={'password'}
                        handleChange={this.handleChange}/>
          <button className={'submit-login'}>Login</button>
          {formError && <div className={'error-form'}>{formError}</div> }
          {hasError && <div className={'error-form'}>{errorMessage}</div> }
        </form>
        <Link to={'/register'} className={'button-bck-purple register-button'}>
          Registrarse
        </Link>
        <img className={'wave-bottom'} src={BottomWave} alt="bottom-wave" />
      </div>
    );
  }
}

export default withAuth(Login);