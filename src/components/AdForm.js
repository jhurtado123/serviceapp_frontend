import React, {Component} from 'react';
import Dropzone from "./Dropzone";
import categoriesApiClient from "../services/apiManager/categories";
import mapboxgl from 'mapbox-gl';
import mapBoxApiClient from "../services/apiManager/mapbox";
import {withRouter} from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;

class AdForm extends Component {

  state = {
    categories: [],
  };

  async componentDidMount() {
    try {
      const {data: {categories}} = await categoriesApiClient.getAllCategories();
      this.setState({
        categories,
      });

      this.props.setCategory(categories[0]._id);
    } catch (e) {
      this.props.history.push('/');
    }
    const {mapCoords: {lat, lng}} = this.props;
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
  }

  componentWillUnmount() {
    map.remove();
  }


  handleMapboxPosition = async () => {
    const {address, postalCode, number, usePersonalAddress} = this.props;
    let data;
    let lat = undefined;
    let lng = undefined;
    if (!usePersonalAddress && address && postalCode) {
      data = await mapBoxApiClient.getCoordinates({address, number, postalCode});
      try {
        lat = data.data.features[0].geometry.coordinates[0];
        lng = data.data.features[0].geometry.coordinates[1];
      } catch (e) {
      }
    }
    if (usePersonalAddress) {
      lat = data.data.features[0].geometry.coordinates[0];
      lng = data.data.features[0].geometry.coordinates[1];
    }

    if (lat && lng) {
      this.setState({
        mapCoords: {
          lat, lng
        }
      });
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


  printCategories() {
    const {category} = this.props;
    return this.state.categories.map((element, index) => {
      const elementId = element._id;
      return <option key={index}
              value={elementId} selected={elementId === category}>{element.name}</option>
    });
  }

  render() {
    const {name, description, price, number, address, postalCode, tags,
      images, usePersonalAddress, error, onChangeEvent, category,
      handleMapboxPosition, checkboxChange, handleRemoveFile, handleNewFile} = this.props;

    return (
      <React.Fragment>
        <div className={'form-title'}>Información general</div>
        <div className={'form-group'}>
          <label>Título</label>
          <input type="text" name={'name'} placeholder={'Título del anuncio'} value={name}
                 onChange={onChangeEvent}/>
        </div>
        <div className={'form-group'}>
          <label>Descripción</label>
          <textarea name={'description'} placeholder={'Descripción del anuncio'} value={description}
                    onChange={onChangeEvent}>{description}</textarea>
        </div>
        <div className={'form-group'}>
          <label>Precio (en serkens)</label>
          <input name={'price'} placeholder={'Precio'} value={price} onChange={onChangeEvent} type={'text'}/>
        </div>
        <div className={'form-title'}>Localización</div>
        <div className={'form-group checkbox'}>
          <input onChange={checkboxChange} onBlur={handleMapboxPosition} id={'usePersonalAddress'}
                 type={'checkbox'} checked={usePersonalAddress} value={usePersonalAddress}
                 name={'usePersonalAddress'}/>
          <label htmlFor={'usePersonalAddress'} className={'checkbox-pretty'}/>
          <label htmlFor={'usePersonalAddress'}>Usar la dirección de mi perfil</label>
        </div>
        <div className={'custom-location' + (!usePersonalAddress ? ' open' : '')}>
          <div className={'dual-form-group'}>
            <div className={'form-group'}>
              <label>Código postal</label>
              <input type="text" name={'postalCode'} placeholder={'Código postal'} value={postalCode}
                     onChange={onChangeEvent} onBlur={this.handleMapboxPosition}/>
            </div>
            <div className={'form-group small'}>
              <label>Número</label>
              <input type="text" name={'number'} placeholder={'Número'} value={number} onChange={onChangeEvent}
                     onBlur={this.handleMapboxPosition}/>
            </div>
          </div>
          <div className={'form-group'}>
            <label>Dirección</label>
            <input type="text" name={'address'} placeholder={'Dirección'} value={address} onChange={onChangeEvent}
                   onBlur={this.handleMapboxPosition}/>
          </div>
        </div>
        <div className={'map'}>
          <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
        </div>

        <div className={'form-title'}>Otros</div>
        <div className={'form-group'}>
          <label>Categoría</label>
          <select name={'category'} onChange={onChangeEvent}>
            {this.printCategories()}
          </select>
        </div>
        <div className={'form-group'}>
          <label>Tags</label>
          <p className={'info-text'}>*Separadas por coma</p>
          <input type="text" name={'tags'} placeholder={'Etiquetas'} value={tags} onChange={onChangeEvent}/>
        </div>
        <div className={'form-group'}>
          <label>Imágenes</label>
          <p className={'info-text'}>*Si no subes ninguna imágen se pondrá por defecto la imagen de categoría</p>
          <Dropzone handleNewFile={handleNewFile} onRemoveImage={handleRemoveFile} images={images}/>
        </div>
        <button className={'button-bck-purple'}>Publicar</button>
        {error && <div className={'error-form'}>{error}</div> }
      </React.Fragment>
    );
  }
}

export default withRouter(AdForm);