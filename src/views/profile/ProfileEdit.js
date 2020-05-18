import React, {Component} from 'react';
import profileApiClient from "../../services/apiManager/profile";
import { withAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import ProfileForm from "../../components/ProfileForm";
import HeaderWithTitle from "../../components/HeaderWithTitle";
import '../../assets/css/views/profile/Profile.scss';
import LoadingBars from "../../components/LoadingBars";

const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class ProfileEdit extends Component {
  state = {
    id: '',
    profile_image:'',
    error: undefined,
    status: STATUS.LOADING,
  }

  async componentDidMount() {
    try {
      const { data } = await profileApiClient.getProfile()
          this.setState({
            id: data._id,
            profile_image: await this.getImage(data.profile_image, data._id),
            status: STATUS.LOADED,
            error: undefined,
          })

    } catch (e) {
      this.props.history.push('/');
    }
  }

  async getImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/profile/${id}/${image}`;
    this.setState({
      url: url,
    })

  }

  render() {
    const { status } = this.state;
    const { url } = this.state;
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADED:
        return (
          <div>
            <HeaderWithTitle title="Editar perfil" />
            <div className={'container'}>
              {/* <div className="header-edit">
                <img className="header-edit" src={require('../../assets/images/views/profile/header-edit.png')} alt="header-edit-profile" />
              </div> */}
              <div className="profile-image-container">
                <div className="img-profile img-profile-edit">
                </div>
                <img className="avatar avatar-edit" src={url} alt="profile" />
              </div>
                <ProfileForm />
            </div>
          </div>
        )
      case STATUS.LOADING:
        return(
          <div>
            <LoadingBars />
          </div>
        )
    }
  }
}

export default withAuth(ProfileEdit);