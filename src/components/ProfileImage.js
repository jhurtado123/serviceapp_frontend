import React, {Component} from 'react';
import '../assets/css/components/profileImage.scss'

class ProfileImage extends Component {
  render() {
    const {user, small} = this.props;
    return (
      <div className={'profile-image ' + (small ? 'small' : '')}>

      </div>
    );
  }
}

export default ProfileImage;