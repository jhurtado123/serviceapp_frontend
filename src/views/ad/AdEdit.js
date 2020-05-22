import React, {Component} from 'react';
import adApiClient from "../../services/apiManager/ad";
import AdForm from "../../components/AdForm";
import Loading from "../Loading";
import REDIRECT from "../../errorRedirects";
import HeaderWithTitle from "../../components/HeaderWithTitle";
import LoadingBars from "../../components/LoadingBars";


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

  handleSubmit = async (state) => {
    try {
      const {match: {params: {id}}} = this.props;
      await adApiClient.updateAd(state, id);
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

  async componentDidMount() {
    try {
      const {match: {params: {id}}} = this.props;
      const {data: {ad}} = await adApiClient.getAdData(id);

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
        images: await this.getImages(ad.images, id),
        isLoading: false,
      });
    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  }

  async getImages(images, id) {
    let responseFiles = [];
    images.map(async (image) => {
      const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: 'image/*'
      };
      const newFile = new File([data], image, metadata);
      newFile.preview = window.URL.createObjectURL(newFile);
      newFile.path = newFile.name;
      responseFiles.push(newFile);
    });
    return responseFiles;
  }

  render() {
    const {isLoading} = this.state;
    return (
      <React.Fragment>
        <HeaderWithTitle title={'Editar anuncio'}/>
        {
          isLoading ? <LoadingBars/> :
            <div className={'container'}>
              <AdForm onSubmit={this.handleSubmit} {...this.state}/>
            </div>
        }
      </React.Fragment>
    );
  }
}

export default AdEdit;