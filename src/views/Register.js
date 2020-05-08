import React, {Component} from 'react';
import TopWave from '../assets/images/views/register/wave-top.png'
import InputWithIcon from "../Components/InputWithIcon";
import '../assets/css/views/register/register.scss';
import RegisterPartOne from "../Components/RegisterPartOne";
import RegisterPartTwo from "../Components/RegisterPartTwo";


class Register extends Component {

  state = {
    name: '',
    username: '',
    password: '',
    isInSecondStep: false,
    validatingUsername: false,
    usernameValidated: false,
    postalCode: '',
    error: undefined,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: undefined,
    })
  };

  handleNextClick = () => {
    const {name, username, password, usernameValidated} = this.state;

    if (!name || !username || !password) {
      this.setState({
        error: 'Debes rellenar todos los campos para continuar.',
      });
    } else if (!usernameValidated) {
      this.setState({
        error: 'El nombre de usuario ya existe',
      });
    } else {
          this.setState({
            isInSecondStep: true,
            error: undefined,
          });
      }
  };

  render() {
    const {isInSecondStep, postalCode, error, validatingUsername} = this.state;
    return (
      <div className={'register'}>
        <img className={'wave-top'} src={TopWave}/>
        <div className={'wrapper'}>
          {!isInSecondStep ?
            <RegisterPartOne {...this.state} validatingUsername={validatingUsername} handleChange={this.handleChange} handleNextClick={this.handleNextClick}/> :
            <RegisterPartTwo postalCode={postalCode} error={error} handleChange={this.handleChange}  />
          }
        </div>
      </div>
    );
  }
}

export default Register;