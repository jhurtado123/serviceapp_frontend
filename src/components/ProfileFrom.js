import React, { Component } from 'react';
import Dropzone from "./Dropzone";
import mapboxgl from 'mapbox-gl';
import mapBoxApiClient from "../services/apiManager/mapbox";
import { withRouter } from 'react-router-dom';
import { withAuth } from "../context/AuthContext";


mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;

class ProfileForm extends Component {

  async componentDidMount() {
    const { mapCoords: { lat, lng } } = this.props;
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
    this.handleMapboxPosition()
  }

  componentWillUnmount() {
    map.remove();
  }


  handleMapboxPosition = async () => {
    const { address, postalcode, number, changeCoords } = this.props;
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

  render(){
    const {
      name, description, error, onChangeEvent, images, postalcode, number, address,
      handleRemoveFile, handleNewFile
    } = this.props;
    return (
      <div>
        <div className={'form-group profile-form'}>
          <label>Nombre</label>
          <input type="text" name={'name'} placeholder={'Nombre'} value={name}
            onChange={onChangeEvent} />
        </div>
        <div className={'form-group'}>
          <label>Descripción</label>
          <textarea name={'description'} placeholder={'Descripción personal'} value={description}
            onChange={onChangeEvent}>{description}</textarea>
        </div>
        <div className={'form-title'}>Localización</div>
        <div className={'custom-location open'}>
          <div className={'dual-form-group'}>
            <div className={'form-group'}>
              <label>Código postal</label>
              <input type="text" name={'postalcode'} placeholder={'Código postal'} value={postalcode}
                onChange={onChangeEvent} onBlur={this.handleMapboxPosition} />
            </div>
            <div className={'form-group small'}>
              <label>Número</label>
              <input type="text" name={'number'} placeholder={'Número'} value={number} onChange={onChangeEvent}
                onBlur={this.handleMapboxPosition} />
            </div>
          </div>
          <div className={'form-group'}>
            <label>Dirección</label>
            <input type="text" name={'address'} placeholder={'Dirección'} value={address} onChange={onChangeEvent}
              onBlur={this.handleMapboxPosition} />
          </div>
        </div>
        <div className={'map'}>
          <div ref={el => this.mapContainer = el} className={'mapContainer'} />
        </div>
        <div className={'form-group'}>
          <label>Imagen de perfil</label>
          <p className={'info-text'}>*Si no subes ninguna imágen se pondrá una imagen de perfil por defecto </p>
          <Dropzone handleNewFile={handleNewFile} onRemoveImage={handleRemoveFile} images={images} />
        </div>
        <button className={'button-bck-purple'}>Guardar cambios</button>
        {error && <div className={'error-form'}>{error}</div>}
      </div>
    )
  }
}

export default withRouter(withAuth(ProfileForm));