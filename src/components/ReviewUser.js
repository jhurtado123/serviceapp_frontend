import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';

class ReviewUser extends Component{

  render(){
    const { category, title, content } = this.props;
    return(
      <div className="review-user" >
        <img className="avatar" src={require('../assets/images/icons/avatar.png')} alt="avatar" />
        <div>
          <div className="review-header">
            <span>{category}</span>
            <img  className="review-star" src={require('../assets/images/icons/stars.png')} alt="stars" />
          </div>
          <p className="review-title" >{title}</p>
          <p className="review-content" >{content}</p>
        </div>
      </div>
    )
  }
}

export default ReviewUser;