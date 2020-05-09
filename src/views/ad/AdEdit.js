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
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adApiClient.updateAd(this.state);
    } catch ({response: {data: {data: errorMessage}}}) {
      this.setState({
        error: errorMessage,
      })
    }
  };

  setCategory = (category) => {
    this.setState({category});
  };

  async componentDidMount() {
    try {
      const {match: {params: { id}}} = this.props;
      const {data: {ad}} = await adApiClient.getAd(id);
      const {data: {images}} = await adApiClient.getAdImages(id);
      this.setState({
        name: ad.name,
        description: ad.description,
        number: ad.number,
        postalCode: ad.postalCode,
        address: ad.address,
        price: ad.price,
        category: ad.category,
        tags: ad.tags.toString(),
        usePersonalAddress: !(ad.address || ad.postalCode),
        mapCoords: {
          lat: ad.location.coordinates[0],
          lng: ad.location.coordinates[1],
        },
        isLoading: false,
      });
    } catch ({response: {data: {data: errorMessage}}}) {
      this.props.history.push('/');
    }
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
                       setCategory={this.setCategory} onChangeEvent={this.handleChange}
                       checkboxChange={this.handleCheckboxChange}/>
            </form>
          </div>
      }
      </React.Fragment>
    );
  }
}

export default AdEdit;