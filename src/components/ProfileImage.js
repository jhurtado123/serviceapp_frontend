import React, {Component} from 'react';
import DefaultProfileImage from '../assets/images/icons/profile.png';
import '../assets/css/components/profileImage.scss'

class ProfileImage extends Component {
  render() {
    const {user, small} = this.props;
    return (
      <div className={'profile-image ' + (small ? 'small' : '')} style={{backgroundImage: `url(${user.profile_image ? `${process.env.REACT_APP_BACKEND_URI}/uploads/profile/${user._id}/${user.profile_image}` : DefaultProfileImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>

      </div>
    );
  }
}

export default ProfileImage;