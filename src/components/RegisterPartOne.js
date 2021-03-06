import React, {Component} from 'react';
import InputWithIcon from "./InputWithIcon";
import Spinner from '../assets/images/loading/spinner.gif'
import CloseRed  from '../assets/images/icons/close-red.png'

class RegisterPartOne extends Component {

  render() {
    const {handleChange, username, name, password , handleNextClick, error, validatingUsername, usernameValidated} = this.props;
    let feedback = validatingUsername ? Spinner : false;
    if (!validatingUsername && usernameValidated === false) {
      feedback = CloseRed;
    }
    return (
      <React.Fragment>
        <h1>
          Bienvenido a
          <span>Serkens</span>
        </h1>
        <InputWithIcon icon={'name-purple'} name={'name'} placeholder={'Tu nombre'} value={name} type={'text'}
                      handleChange={handleChange}/>
        <InputWithIcon icon={'user-purple'} name={'username'} placeholder={'Tu nombre de usuario'} value={username}
                      type={'text'} feedback={feedback}
                      handleChange={handleChange}/>
        <InputWithIcon icon={'lock-purple'} name={'password'} placeholder={'Tu contraseña'} value={password}
                      type={'password'}
                      handleChange={handleChange}/>
        {error && <div className={'error-form'}>{error}</div> }
        <button className={'button-bck-purple register-button'} onClick={handleNextClick} >Siguiente</button>
      </React.Fragment>
    );
  }
}

export default RegisterPartOne;