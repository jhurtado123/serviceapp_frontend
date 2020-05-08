import React, {Component} from 'react';
import '../assets/css/views/loading/index.scss'
import LoadingSpinner from '../assets/images/loading/spinner.gif';

class Loading extends Component {
  render() {
    return (
      <div className={'loading'}>
        <img src={LoadingSpinner} alt=""/>
      </div>
    );
  }
}

export default Loading;