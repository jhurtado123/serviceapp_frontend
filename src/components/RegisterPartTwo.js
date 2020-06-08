import React, {Component} from 'react';
import InputWithIcon from "./InputWithIcon";

class RegisterPartTwo extends Component {
  render() {
    const {postalCode, handleChange, onRegister, error} = this.props;
    return (
      <React.Fragment>
        <InputWithIcon icon={'location-purple'} name={'postalCode'} placeholder={'Tu código postal'} value={postalCode} type={'text'}
                      handleChange={handleChange}/>
        {error && <div className={'error-form'}>{error}</div> }
        <button className={'button-bck-purple register-button'} onClick={onRegister} >Registrarme</button>
      </React.Fragment>
    );
  }
}

export default RegisterPartTwo;