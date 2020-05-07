import React, {Component} from 'react';
import '../assets/css/components/InputWithIcon.scss';

class InputWithIcon extends Component {
  render() {
    const {icon, name, value, handleChange, type} = this.props;
    return (
      <div className={'inputWithIcon'}>
        <img src={require('../assets/images/icons/' + icon + '.png')} alt=""/>
        <input type={type} name={name} value={value} onChange={handleChange}/>
      </div>
    );
  }
}

export default InputWithIcon;