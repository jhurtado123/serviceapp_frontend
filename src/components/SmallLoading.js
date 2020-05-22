import React, { Component } from 'react';
import LoadingSpinner from '../assets/images/loading/spinner.gif';


class SmallLoading extends Component {
  render(){
    return(
      <div className={'small-loading'}>
        <img src={LoadingSpinner} alt="" />
      </div>
    )
  }
}
export default SmallLoading; 