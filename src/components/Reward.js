import React, { Component } from 'react';
import "../assets/css/views/profile/rewards.scss"; 

class Reward extends Component {
  render() {
    const { title, points, progress, status} = this.props; 
    return (
      <div className={'reward-container'}>
        <div className={'reward-header'}>
          <span className={'reward-title'}>{title}</span>
          <span className={'reward-pts'}>{points} pts</span>
        </div>
        <div className={'reward-progress-bar'}>
          <div className={'reward-progress-bar bar-color'} style={{width: `${progress}%`}}></div>
        </div>
        <p className={'next-reward'}>{status}</p>
      </div>
    )
  }
}

export default Reward;