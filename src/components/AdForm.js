import React, {Component} from 'react';
import Dropzone from "./Dropzone";
import categoriesApiClient from "../services/apiManager/categories";
import mapboxgl from 'mapbox-gl';
import mapBoxApiClient from "../services/apiManager/mapbox";
import {withRouter} from 'react-router-dom';
import {withAuth} from "../context/AuthContext";

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;

class AdForm extends Component {

  state = {
    name: this.props.name,
    description: this.props.description,
    number: this.props.number ? this.props.number : '',
    postalCode: this.props.postalCode ? this.props.postalCode : '',
    address: this.props.address ? this.props.address : '',
    price: this.props.price,
    category: this.props.category,
    tags: this.props.tags ? this.props.tags : '',
    images: this.props.images ? this.props.images : [],
    usePersonalAddress: this.props.usePersonalAddress,
    mapCoords: {
      lat: this.props.mapCoords ? this.props.mapCoords.lat : this.props.user.location.coordinates[0],
      lng: this.props.mapCoords ? this.props.mapCoords.lng : this.props.user.location.coordinates[1],
    },
    formErrors: {name: '', description: '', number: '', postalCode: '', address: '', price: ''},
    error: undefined,
    categories: [],
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
      case 'price':
        if (isNaN(value)) {
          formErrors[name] = 'Precio incorrecto';
        } else if(parseInt(value) < 1) {
          formErrors[name] = 'El precio ha de ser superior a 0';
        }
      default:
        break;
    }

    return formErrors;
  };

  _isValidPostalCode(postalCode) {
    return /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(postalCode);
  }

  handleCheckboxChange = (e) => {
    const {formErrors} = this.state;
    formErrors['number'] = '';
    formErrors['postalCode'] = '';
    formErrors['address'] = '';
    this.setState({
      [e.target.name]: e.target.checked,
      address: '',
      number: '',
      postalCode: '',
      formErrors,
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
  handleChangeCoordinates = (coords) => {
    this.setState({
      mapCoords: coords,
    })
  };


  async componentDidMount() {
    try {
      const {data: {categories}} = await categoriesApiClient.getAllCategories();
      this.setState({
        categories,
        category: [categories[0]._id],
      });
      const {setCategory} = this.props;
      if (setCategory) {
        setCategory(categories[0]._id);
      }
    } catch (e) {
      this.props.history.push('/');
    }
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
  }

  componentWillUnmount() {
    map.remove();
  }


  handleMapboxPosition = async () => {
    const {address, postalCode, number, usePersonalAddress} = this.state;
    let data;
    let lat = undefined;
    let lng = undefined;
    if (!usePersonalAddress && address && postalCode) {
      data = await mapBoxApiClient.getCoordinates({address, number, postalCode});
      try {
        lat = data.data.features[0].geometry.coordinates[0];
        lng = data.data.features[0].geometry.coordinates[1];
        this.handleChangeCoordinates({lat, lng});
      } catch (e) {
      }
    }
    if (usePersonalAddress) {
      lat = this.props.user.location.coordinates[0];
      lng = this.props.user.location.coordinates[1];
      this.handleChangeCoordinates({lat, lng});
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

  handleSubmit = (e) => {
    e.preventDefault();
    if (this._isValidForm()) {
      const {onSubmit} = this.props;
      onSubmit(this.state);
    } else {
      this.setState({
        error: 'Hay errores en el formulario'
      })
    }
  };

  _isValidForm = () => {
    const {formErrors, address, postalCode, usePersonalAddress, price, name, description} = this.state;
    let response = true;
    Object.keys(formErrors).forEach(key => {
      if (formErrors[key]) {
        response = false;
      }
    });
    if (response && (!name || !description || !price)) {
      response = false;
    }
    if (response && !usePersonalAddress && (!postalCode || !address)) {
      response = false;
    }

    return response;
  };

  handleCheckboxChangeForm = (e) => {
    this.handleCheckboxChange(e);
    setTimeout(this.handleMapboxPosition, 200);
  };


  printCategories() {
    return this.state.categories.map((element, index) => <option 
      key={index}
      value={element._id}>
        {element.name}
      </option>);
  }

  render() {
    const {
      name, description, price, number, address, postalCode, tags,
      images, usePersonalAddress, error, category, formErrors
    } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className={'form-title'}>Información general</div>
          <div className={'form-group'}>
            <label>Título</label>
            <input type="text" name={'name'} placeholder={'Título del anuncio'} value={name}
                  onChange={this.handleChange}/>
            <div className={'form-input-error'}>{formErrors['name'] && formErrors['name']}</div>
          </div>
          <div className={'form-group'}>
            <label>Descripción</label>
            <textarea name={'description'} placeholder={'Descripción del anuncio'} value={description}
                      onChange={this.handleChange}/>
            <div className={'form-input-error'}>{formErrors['description'] && formErrors['description']}</div>
          </div>
          <div className={'form-group'}>
            <label>Precio (en serkens)</label>
            <input name={'price'} placeholder={'Precio'} value={price} onChange={this.handleChange}
                  data-validate={'price'} type={'text'}/>
            <div className={'form-input-error'}>{formErrors['price'] && formErrors['price']}</div>
          </div>
          <div className={'form-title'}>Localización</div>
          <div className={'form-group checkbox'}>
            <input onChange={this.handleCheckboxChangeForm} onBlur={this.handleMapboxPosition} id={'usePersonalAddress'}
                  type={'checkbox'} checked={usePersonalAddress} value={usePersonalAddress}
                  name={'usePersonalAddress'}/>
            <label htmlFor={'usePersonalAddress'} className={'checkbox-pretty'}/>
            <label htmlFor={'usePersonalAddress'}>Usar la dirección de mi perfil</label>
          </div>
          <div className={'custom-location' + (!usePersonalAddress ? ' open' : '')}>
            <div className={'dual-form-group'}>
              <div className={'form-group'}>
                <label>Código postal</label>
                <input type="text" name={'postalCode'} data-validate={'postalCode'} placeholder={'Código postal'}
                      value={postalCode}
                      onChange={this.handleChange} onBlur={this.handleMapboxPosition}/>
                <div className={'form-input-error'}>{formErrors['postalCode'] && formErrors['postalCode']}</div>
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
          <div className={'form-title'}>Otros</div>
          <div className={'form-group'}>
            <label>Categoría</label>
            <select name={'category'} onChange={this.handleChange} value={category}>
              {this.printCategories()}
            </select>
          </div>
          <div className={'form-group'}>
            <label>Etiquetas</label>
            <p className={'info-text'}>*Separadas por coma</p>
            <input type="text" name={'tags'} placeholder={'Etiquetas'} value={tags} onChange={this.handleChange}/>
          </div>
          <div className={'form-group'}>
            <label>Imágenes</label>
            <p className={'info-text'}>*Si no subes ninguna imágen se pondrá por defecto la imagen de categoría</p>
            <Dropzone handleNewFile={this.handleNewFile} onRemoveImage={this.handleRemoveFile} images={images}/>
          </div>
          <button className={'button-bck-purple'}>Publicar</button>
          {error && <div className={'error-form'}>{error}</div>}
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(withAuth(AdForm));