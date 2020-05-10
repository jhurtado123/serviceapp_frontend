import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';

class ReviewUser extends Component{

  render(){
    const { content } = this.props;
    return(
      <div className="ReviewUser" >
        <img className="Avatar" src={require('../assets/images/icons/avatar.png')} alt="avatar" />
        <div>
          <div className="ReviewHeader">
            <span>Test para el anuncio</span>
            <img  className="ReviewStar" src={require('../assets/images/icons/stars.png')} alt="stars" />
          </div>
          <p className="ReviewTitle" >Titulo Anuncio</p>
          <p className="ReviewContent" >{content}</p>
        </div>
      </div>
    )
  }
}

export default ReviewUser;