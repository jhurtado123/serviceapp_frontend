import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import profileApiClient from "../services/apiManager/profile";
import mapBoxApiClient from "../services/apiManager/mapbox";
import {withRouter} from 'react-router-dom';
import {withAuth} from "../context/AuthContext";
import ProfileImage from "./ProfileImage";
import '../assets/css/views/profile/edit.scss';
import Edit from '../assets/images/icons/edit.png';


mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;

const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class ProfileForm extends Component {
  state = {
    id: '',
    name: '',
    description: '',
    address: '',
    images: [],
    selectedImage: null,
    usePersonalAddress: true,
    mapCoords: {
      lat: 2.17694,
      lng: 41.3825,
    },
    error: undefined,
    formErrors: {
      name: '', description: '', address: '', number:'', postalcode: '',
    },
    encodedFile: undefined,
    status: STATUS.LOADING,
  };

  inputImage = React.createRef();

  async componentDidMount() {
    try {
      const {data} = await profileApiClient.getProfile();
      this.setState({
        id: data._id,
        name: data.name,
        address: data.address,
        description: data.description,
        postalcode: data.postalcode,
        number: data.number,
        url: await this.getImage(data.profile_image, data._id),
        status: STATUS.LOADED,
        error: undefined,
      });
      this.handleMapboxPosition();
      const {mapCoords: {lat, lng}} = this.state;
      map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [lat, lng],
        zoom: 14,
        interactive: false,
        scrollZoom: false,
      });

      marker = new mapboxgl.Marker()
        .setLngLat([lat, lng])
        .addTo(map);

    } catch (e) {
      this.props.history.push('/500');
    }
  }


  componentWillUnmount() {
    map.remove();
  }

  async getImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/profile/${id}/${image}`;
    return url;
  }

  handleMapboxPosition = async () => {
    const {address, postalcode, number, changeCoords} = this.state;
    let data;
    let lat = undefined;
    let lng = undefined;
    if (address && postalcode) {
      data = await mapBoxApiClient.getCoordinates({address, number, postalcode});
      try {
        lat = data.data.features[0].geometry.coordinates[0];
        lng = data.data.features[0].geometry.coordinates[1];
        this.setState({
          mapCoords: {
            lat: lat,
            lng: lng,
          },
        });
      } catch (e) {
      }
    }

    if (lat && lng) {
      if (marker) marker.remove();
      map.flyTo({
        center: [lat, lng],
        essential: true,
        zoom: 14,
      });
      marker = new mapboxgl.Marker()
        .setLngLat([lat, lng])
        .addTo(map);
    }

  };
  handleOpenFileInput = () => {
    this.inputImage.current.click();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: undefined,
    });
    const formErrors = this.validateInput(e);
    this.setState({
      formErrors
    });
  };

  validateInput = (event) => {
    const {name, value} = event.target;
    const {formErrors} = this.state;
    formErrors[name] = '';

    if (!value) {
      formErrors[name] = 'Debes rellenar este campo';
      return formErrors;
    }
    switch (event.target.getAttribute('data-validate')) {
      case 'postalCode':
        if (!this._isValidPostalCode(value)) {
          formErrors[name] = 'Código postal incorrecto';
        }
        break;
      default:
        break;
    }

    return formErrors;
  };

  _isValidPostalCode(postalCode) {
    return /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(postalCode);
  }

  handleNewImage = (e) => {
    this.setState({
      images: [e.target.files[0]],
      profile_image: e.target.files[0].name,
    });
    this.setBase64(e.target.files[0]);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {user} = this.props;
    if (this._isValidForm()) {
      try {
        const {data: {image}} = await profileApiClient.updateProfile(this.state);
        user.location.coordinates = [this.state.mapCoords.lat, this.state.mapCoords.lng];
        user.name = this.state.name;
        user.description = this.state.description;
        user.profile_image = image;

        this.props.history.push('/profile')
      } catch ({response: {data: {data: errorMessage}}}) {
        this.setState({
          error: errorMessage,
        })
      }
    } else {
      this.setState({
        error: 'Hay errores en el formulario'
      })
    }
  };

  _isValidForm = () => {
    const {formErrors} = this.state;
    let response = true;
    Object.keys(formErrors).forEach(key => {
      if (formErrors[key]) {
        response = false;
      }
    });

    return response;
  };

  setBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        encodedFile: reader.result,
      })
    };
  }

   render() {
    const {name, description, error, postalcode, number, address, encodedFile, formErrors} = this.state;
    const {user} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={'edit-profile-form'}>
          <div className={'profile-image-container'} onClick={this.handleOpenFileInput}>
            <ProfileImage user={user} otherImage={encodedFile} />
            <div className={'edit-image-info'}>
              <img src={Edit} alt="edit"/>
            </div>
            <input type="file" onChange={this.handleNewImage} accept="image/*" hidden ref={this.inputImage}/>
          </div>
          <div className={'form-group profile-form'}>
            <label>Nombre</label>
            <input type="text" name={'name'} placeholder={'Nombre'} value={name}
                   onChange={this.handleChange}/>
            <div className={'form-input-error'}>{formErrors['name'] && formErrors['name']}</div>
          </div>
          <div className={'form-group'}>
            <label>Descripción</label>
            <textarea name={'description'} placeholder={'Descripción personal'} value={description}
                      onChange={this.handleChange}>{description}</textarea>
            <div className={'form-input-error'}>{formErrors['description'] && formErrors['description']}</div>
          </div>
          <div className={'form-title'}>Localización</div>
          <div className={'custom-location open'}>
            <div className={'dual-form-group'}>
              <div className={'form-group'}>
                <label>Código postal</label>
                <input type="text" data-validate={'postalCode'} name={'postalcode'} placeholder={'Código postal'} value={postalcode}
                       onChange={this.handleChange} onBlur={this.handleMapboxPosition}/>
                <div className={'form-input-error'}>{formErrors['postalcode'] && formErrors['postalcode']}</div>
              </div>
              <div className={'form-group small'}>
                <label>Número</label>
                <input type="text" name={'number'} placeholder={'Número'} value={number} onChange={this.handleChange}
                       onBlur={this.handleMapboxPosition}/>
                <div className={'form-input-error'}>{formErrors['number'] && formErrors['number']}</div>
              </div>
            </div>
            <div className={'form-group'}>
              <label>Dirección</label>
              <input type="text" name={'address'} placeholder={'Dirección'} value={address} onChange={this.handleChange}
                     onBlur={this.handleMapboxPosition}/>
              <div className={'form-input-error'}>{formErrors['address'] && formErrors['address']}</div>
            </div>
          </div>
          <div className={'map'}>
            <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
          </div>

          <button className={'button-bck-purple'}>Guardar cambios</button>
          {error && <div className={'error-form'}>{error}</div>}
        </div>
      </form>
    )
  }
}

export default withRouter(withAuth(ProfileForm));