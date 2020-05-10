import React, {Component} from 'react';
import '../../assets/css/views/ad/create.scss';
import adApiClient from '../../services/apiManager/ad';
import AdForm from "../../components/AdForm";
import {withAuth} from "../../context/AuthContext";
import REDIRECT from "../../errorRedirects";
import HeaderWithTitle from "../../components/HeaderWithTitle";


class AdCreate extends Component {

  state = {
    name: '',
    description: '',
    number: '',
    postalCode: '',
    address: '',
    price: '',
    category: '',
    tags: '',
    images: [],
    usePersonalAddress: true,
    mapCoords: {
      lat: this.props.user.location.coordinates[0],
      lng: this.props.user.location.coordinates[1],
    },
    error: undefined,
  };

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
  handleChangeCoordinates = (coords) => {
    this.setState({
      mapCoords: coords,
    })
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adApiClient.createAd(this.state);
      this.props.history.push('/ads');
    } catch (error) {
      if (error.response) {
        if (error.response.data.data) {
          this.setState({
            error: error.response.data.data,
          });
        } else {
          this.props.history.push(REDIRECT[error.response.status]);
        }
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  };

  setCategory = (category) => {
    this.setState({category});
  };


  render() {
    return (
      <React.Fragment>
        <HeaderWithTitle title={'Publicar anuncio'}/>
        <div className={'container'}>
          <form onSubmit={this.handleSubmit}>
            <AdForm  {...this.state} handleRemoveFile={this.handleRemoveFile} handleNewFile={this.handleNewFile}
                     setCategory={this.setCategory} onChangeEvent={this.handleChange}
                     checkboxChange={this.handleCheckboxChange} changeCoords={this.handleChangeCoordinates}/>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default withAuth(AdCreate);