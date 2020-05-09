import React, {Component} from 'react';
import profileApiClient from "../../services/apiManager/profile";
import SearchBar from "../../components/SearchBar";
import {Link} from "react-router-dom";
import Loading from "../Loading";
import ProfileAdBox from "../../components/ProfileAdBox";
import adApiClient from "../../services/apiManager/ad";

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
        isLoading:false
      });
    } catch (e) {
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

      });
  };

  getAdsToPrint = () => {
    let {ads, search} = this.state;

    search = search.toLowerCase();
    return ads.map((ad, index) => {
      if ((search && (ad.name.toLowerCase().includes(search) || ad.description.toLowerCase().includes(search))) || !search) {
        return <ProfileAdBox key={index} {...ad} handleDelete={this.handleDelete}/>;
      }
    });
  };

  render() {
    const {search, ads, isLoading} = this.state;
    return (
      <React.Fragment>
        {isLoading ? <Loading/> : (
          <div>
            <SearchBar handleChange={this.handleChange} searchValue={search} placeholder={'Buscar anuncios'}/>
            <div className={'ads-list container'}>
              {!!ads.length ? this.getAdsToPrint() :
                <div className={'page-message'}>
                  <p>¡Aún no tienes anuncios publicados!</p>
                  <Link to={'/ad/create'} className={'button-bck-purple'}>Subir anuncio</Link>
                </div>}
            </div>
          </div>)}
      </React.Fragment>
    )
  }
}

export default ProfileAds;