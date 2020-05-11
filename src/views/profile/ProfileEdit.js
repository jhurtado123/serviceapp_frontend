import React, {Component} from 'react';
import profileApiClient from "../../services/apiManager/profile";
import Loading from "../Loading";
import ProfileForm from "../../components/ProfileFrom";
import '../../assets/css/views/profile/Profile.scss';



class ProfileEdit extends Component {
  state = {
    id: '',
    name: '',
    description: '',
    address: '',
    images: [],
    usePersonalAddress: true,
    mapCoords: {
      lat: 2.17694,
      lng: 41.3825,
    },
    error: undefined,
    isLoading: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: undefined,
    });
  };
  handleCheckboxChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    })
  };
  handleNewFile = (files) => {
    this.setState({
      images: this.state.images.concat(files),
    })
  };
  handleRemoveFile = (file) => {
    this.setState({
      images: this.state.images.filter(image => image !== file),
    })
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileApiClient.updateProfile(this.state);
      this.props.history.push('/profile')
    } catch ({ response: { data: { data: errorMessage } } }) {
      this.setState({
        error: errorMessage,
      })
    }
    
  };

  async componentDidMount() {
    try {
      const { data } = await profileApiClient.getProfile()
          this.setState({
            id: data._id,
            name: data.name,
            address: data.address,
            description: data.description,
            postalcode: data.postalcode,
            number: data.number,
            images: await this.getImages([data.profile_image], data._id),
            url: '',
            mapCoords: {
              lat: data.location.coordinates[0],
              lng: data.location.coordinates[1],
            },
            isLoading: false,
            error: undefined,
          })

    } catch (e) {
      this.props.history.push('/');
    }
  }

  async getImages(images, id) {
    let responseFiles = [];
    images.map(async (image) => {
      const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/profile/${id}/${image}`;
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: 'image/*'
      };
      this.setState({
        url: url,
      })
      responseFiles.push(new File([data], image, metadata));
    });
    return responseFiles;
  }

  render() {
    const { isLoading } = this.state;
    const { url } = this.state;
    return (
      <div>
        {
          isLoading ? <Loading /> :
            <div className={'container'}>
              <div className="HeaderEdit">
                <img className="HeaderEdit" src={require('../../assets/images/views/profile/header-edit.png')} alt="header-edit-profile" />
              </div>
              <div className="ImgProfile profile-image">
                <img className="Avatar" src={url} alt="profile" />
              </div>
              <div className="text-edit"> Editar Perfil</div>
              <form onSubmit={this.handleSubmit}>
                <ProfileForm  {...this.state} handleRemoveFile={this.handleRemoveFile} handleNewFile={this.handleNewFile}
                  onChangeEvent={this.handleChange}
                  />
              </form>
            </div>
        }
      </div>
    );
  }
}

export default ProfileEdit;