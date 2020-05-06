import React, {Component} from 'react';
import InputWithIcon from "./InputWithIcon";

class RegisterPartTwo extends Component {
  render() {
    const {postalCode, handleChange} = this.props;
    return (
      <React.Fragment>
        <InputWithIcon icon={'location-purple'} name={'postalCode'} placeholder={'Tu código postal'} value={postalCode} type={'text'}
                       handleChange={handleChange}/>

        <button className={'button-bck-purple register-button'} onClick={''} >Registrarme</button>
      </React.Fragment>
    );
  }
}

export default RegisterPartTwo;