import React, {Component} from 'react';
import profileApiClient from "../../services/apiManager/profile";
import SearchBar from "../../components/SearchBar";
import {Link} from "react-router-dom";
import Loading from "../Loading";
import ProfileAdBox from "../../components/ProfileAdBox";
import adApiClient from "../../services/apiManager/ad";
import REDIRECT from "../../errorRedirects";
import BaseLayout from "../layouts/BaseLayout";
import '../../assets/css/views/profile/ads.scss';
import LoadingBars from "../../components/LoadingBars";

class ProfileAds extends Component {

  state = {
    isLoading: true,
    search: '',
    ads: [],
  };

  async componentDidMount() {
    try {
      const {data: {ads}} = await profileApiClient.getAds();
      this.setState({
        ads,
        isLoading: false
      });
    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  handleDelete = (e, id) => {
    const {ads} = this.state;
    adApiClient.removeAd(id)
      .then(({ad}) => {
        this.setState({
          ads: ads.filter(ad => ad._id !== id),
          search: '',
        });
      })
      .catch(error => {
        if (error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      });
  };

  getAdsToPrint = () => {
    let {ads, search} = this.state;

    search = search.toLowerCase();
    return ads.map((ad, index) => {
      if ((search && (ad.name.toLowerCase().includes(search) || ad.description.toLowerCase().includes(search))) || !search) {
        return <ProfileAdBox key={index} ad={ad} handleDelete={this.handleDelete}/>;
      }
    });
  };

  render() {
    const {search, ads, isLoading} = this.state;
    return (
      <BaseLayout>
        {isLoading ? <LoadingBars/> : (
          <div>
            <SearchBar handleChange={this.handleChange} searchValue={search} placeholder={'Buscar anuncios'}/>
            <div className={'ads-list container'}>
              {!!ads.length ? this.getAdsToPrint() :
                <div className={'page-message'}>
                  <p>¡Aún no tienes anuncios publicados!</p>
                  <Link to={'/ad/create'} className={'button-bck-purple'}>Subir anuncio</Link>
                </div>}
              <Link className={'recover-ads-button'} to={'/ads/recover'}>Recuperar anuncios eliminados</Link>
            </div>
          </div>)}
      </BaseLayout>
    )
  }
}

export default ProfileAds;