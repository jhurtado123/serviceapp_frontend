import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import profileApiClient from "../services/apiManager/profile";
import mapBoxApiClient from "../services/apiManager/mapbox";
import { withRouter } from 'react-router-dom';
import { withAuth } from "../context/AuthContext";


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
    status: STATUS.LOADING,
  }

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
        url: await this.getImage(data.profile_image, data._id),
        status: STATUS.LOADED,
        error: undefined,
      })
      this.handleMapboxPosition()
      const { mapCoords: { lat, lng } } = this.state;
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
    const { address, postalcode, number, changeCoords } = this.state;
    let data;
    let lat = undefined;
    let lng = undefined;
    if ( address && postalcode) {
      data = await mapBoxApiClient.getCoordinates({ address, number, postalcode });
      try {
        lat = data.data.features[0].geometry.coordinates[0];
        lng = data.data.features[0].geometry.coordinates[1];
        changeCoords({ lat, lng });
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

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: undefined,
    });
  };
  handleNewFile = (files) => {
    this.setState({
      images: this.state.images.concat(files),
    })
  };
  handleNewImage = (e) => {
    this.setState({
      images: [e.target.files[0]],
      profile_image: e.target.files[0].name,
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

  render(){
    const {name, description, error, postalcode, number, address } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <div className={'form-group profile-form'}>
            <label>Nombre</label>
            <input type="text" name={'name'} placeholder={'Nombre'} value={name}
              onChange={this.handleChange} />
          </div>
          <div className={'form-group'}>
            <label>Descripción</label>
            <textarea name={'description'} placeholder={'Descripción personal'} value={description}
              onChange={this.handleChange}>{description}</textarea>
          </div>
          <div className={'form-title'}>Localización</div>
          <div className={'custom-location open'}>
            <div className={'dual-form-group'}>
              <div className={'form-group'}>
                <label>Código postal</label>
                <input type="text" name={'postalcode'} placeholder={'Código postal'} value={postalcode}
                onChange={this.handleChange} onBlur={this.handleMapboxPosition} />
              </div>
              <div className={'form-group small'}>
                <label>Número</label>
              <input type="text" name={'number'} placeholder={'Número'} value={number} onChange={this.handleChange}
                  onBlur={this.handleMapboxPosition} />
              </div>
            </div>
            <div className={'form-group'}>
              <label>Dirección</label>
            <input type="text" name={'address'} placeholder={'Dirección'} value={address} onChange={this.handleChange}
                onBlur={this.handleMapboxPosition} />
            </div>
          </div>
          <div className={'map'}>
            <div ref={el => this.mapContainer = el} className={'mapContainer'} />
          </div>
          <div className={'form-group'}>
            <label>Imagen de perfil</label>
            <p className={'info-text'}>*Si no subes ninguna imágen se pondrá una imagen de perfil por defecto </p>
            <input type="file" onChange={this.handleNewImage} />
          </div>
          <button className={'button-bck-purple'} onClick={this.handleSubmit}>Guardar cambios</button>
          {error && <div className={'error-form'}>{error}</div>}
        </div>
      </form>
    )
  }
}

export default withRouter(withAuth(ProfileForm));