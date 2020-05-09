import React, {Component} from 'react';
import '../assets/css/components/InputWithIcon.scss';

class InputWithIcon extends Component {
  render() {
    const {icon, name, value, handleChange, type, placeholder, feedback} = this.props;
    return (
      <div className={'inputWithIcon'}>
        <img src={require('../assets/images/icons/' + icon + '.png')} alt=""/>
        <input type={type} name={name} value={value} onChange={handleChange} placeholder={placeholder}/>
        {feedback && <img className={'feedback'} src={feedback} alt=""/>}
      </div>
    );
  }
}

export default InputWithIcon;