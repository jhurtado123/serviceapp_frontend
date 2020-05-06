import React, {Component} from 'react';
import InputWithIcon from "./InputWithIcon";

class RegisterPartOne extends Component {

  render() {
    const {handleChange, username, name, password , handleNextClick, error} = this.props;
    return (
      <React.Fragment>
        <h1>
          Bienvenido a
          <span>Serkens</span>
        </h1>
        <InputWithIcon icon={'name-purple'} name={'name'} placeholder={'Tu nombre'} value={name} type={'text'}
                       handleChange={handleChange}/>
        <InputWithIcon icon={'user-purple'} name={'username'} placeholder={'Tu nombre de usuario'} value={username}
                       type={'text'}
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