import React, {Component} from 'react';
import adApiClient from "../../services/apiManager/ad";
import AdForm from "../../components/AdForm";
import Loading from "../Loading";


class AdEdit extends Component {
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
    isLoading: true,
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
  handleChangeCoordinates = (coords) =>{
    this.setState({
      mapCoords: coords,
    })
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {match: {params: { id}}} = this.props;
      await adApiClient.updateAd(this.state, id);
      this.props.history.push('/ads');
    } catch ({response: {data: {data: errorMessage}}}) {
      this.setState({
        error: errorMessage,
      })
    }
  };

  async componentDidMount() {
    try {
      const {match: {params: { id}}} = this.props;
      const {data: {ad}} = await adApiClient.getAd(id);

      this.setState({
        name: ad.name,
        description: ad.description,
        number: ad.number,
        postalCode: ad.postalCode,
        address: ad.address,
        price: ad.price,
        category: ad.category._id,
        tags: ad.tags.toString(),
        usePersonalAddress: !(ad.address || ad.postalCode),
        mapCoords: {
          lat: ad.location.coordinates[0],
          lng: ad.location.coordinates[1],
        },
        images: await this.getImages(ad.images, id),
        isLoading: false,
      });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  async getImages(images, id) {
    let responseFiles = [];
    images.map(async (image) => {
      const url =  `${ process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: 'image/*'
      };
     responseFiles.push(new File([data], image, metadata));
    });
   return responseFiles;
  }

  render() {
    const {isLoading} = this.state;
    return (
      <React.Fragment>
      {
        isLoading ? <Loading/> :
          <div className={'container'}>
            <form onSubmit={this.handleSubmit}>
              <AdForm  {...this.state} handleRemoveFile={this.handleRemoveFile} handleNewFile={this.handleNewFile}
                       onChangeEvent={this.handleChange}
                       checkboxChange={this.handleCheckboxChange} changeCoords={this.handleChangeCoordinates}/>
            </form>
          </div>
      }
      </React.Fragment>
    );
  }
}

export default AdEdit;