import React, { Component } from 'react';
import '../assets/css/views/profile/Profile.scss';
import ProfileImage from "./ProfileImage";
import { Link } from "react-router-dom";

class ReviewUser extends Component{


  displayStars = () => {
    const { rating } = this.props;
    // eslint-disable-next-line default-case
    switch (rating) {
      case 5:
        return <div className={'stars'}> <span className={'stars-active'}>★★★★★</span></div>
      case 4:
        return <div className={'stars'}>★<span className={'stars-active'}>★★★★</span></div>
      case 3:
        return <div className={'stars'}>★★★<span className={'stars-active'} >★★</span></div>
      case 2:
        return <div className={'stars'}>★★★<span className={'stars-active'}>★★</span></div>
      case 1:
        return <div className={'stars'}>★<span className={'stars-active'}>★★★★</span></div>
      case 0:
        return <div className={'stars'}>★★★★★</div>
    }
  }

  render(){
    const { content, user } = this.props;
    return(
      <div className="review-user" >
        <div className={'review-image'}>
          <Link to={`profile/user/`}>
            <ProfileImage user={user} />
          </Link>
        </div>
        <div className="review-container">
            <p className="review-content" >{content}</p>
            {this.displayStars()}
        </div>
      </div>
    )
  }
}

export default ReviewUser;