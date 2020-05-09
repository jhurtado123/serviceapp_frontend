import React, {Component} from 'react';
import '../../assets/css/views/ad/create.scss';
import adApiClient from '../../services/apiManager/ad';
import AdForm from "../../components/AdForm";


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
      lat: -77.04,
      lng: 38.907,
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
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adApiClient.createAd(this.state);
    } catch ({response: {data: {data: errorMessage}}}) {
      this.setState({
        error: errorMessage,
      })
    }
  };

  setCategory = (category) => {
    this.setState({category});
  };


  render() {
    return (
      <div className={'container'}>
        <form onSubmit={this.handleSubmit}>
          <AdForm  {...this.state} handleRemoveFile={this.handleRemoveFile} handleNewFile={this.handleNewFile}
                   setCategory={this.setCategory} onChangeEvent={this.handleChange}
                   checkboxChange={this.handleCheckboxChange}/>
        </form>
      </div>
    );
  }
}

export default AdCreate;