import React, {Component} from 'react';
import TopWave from '../assets/images/views/register/wave-top.png'
import '../assets/css/views/register/register.scss';
import authApiClient from "../services/apiManager/auth";
import RegisterPartOne from "../Components/RegisterPartOne";
import RegisterPartTwo from "../Components/RegisterPartTwo";


class Register extends Component {

  state = {
    name: '',
    username: '',
    password: '',
    isInSecondStep: false,
    validatingUsername: false,
    usernameValidated: undefined,
    postalCode: '',
    error: undefined,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: undefined,
    });
    if (e.target.name === 'username') {
      this.setState({
        usernameValidated: undefined,
        validatingUsername: true,
      });
      authApiClient.doesUsernameExist({username: e.target.value})
        .then(({data}) => {
            this.setState({
              usernameValidated: !data.data,
              validatingUsername: false,
            });
        })
        .catch(error => {
          this.setState({
            usernameValidated: false,
            validatingUsername: false,
          });
        })
    }
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

  handleRegister = () => {
    const {name, username, password, postalCode} = this.state;

    if (!postalCode) {
      this.setState({
        error: 'Debes rellenar todos los campos para continuar.',
      });
    }
  };

  _isValidPostalCode(postal)

  render() {
    const {isInSecondStep, usernameValidated, postalCode, error, validatingUsername} = this.state;
    return (
      <div className={'register'}>
        <img className={'wave-top'} src={TopWave}/>
        <div className={'wrapper'}>
          {!isInSecondStep ?
            <RegisterPartOne {...this.state} usernameValidated={usernameValidated}
                             validatingUsername={validatingUsername} handleChange={this.handleChange}
                             handleNextClick={this.handleNextClick}/> :
            <RegisterPartTwo onRegister={this.handleRegister} postalCode={postalCode} error={error} handleChange={this.handleChange}/>
          }
        </div>
      </div>
    );
  }
}

export default Register;