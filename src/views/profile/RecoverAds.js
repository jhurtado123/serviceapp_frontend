import React, {Component} from 'react';
import profileApiClient from "../../services/apiManager/profile";
import SearchBar from "../../components/SearchBar";
import {Link} from "react-router-dom";
import Loading from "../Loading";
import ProfileAdBox from "../../components/ProfileAdBox";
import adApiClient from "../../services/apiManager/ad";

class RecoverAds extends Component {

  state = {
    isLoading: true,
    search: '',
    ads: [],
  };

  async componentDidMount() {
    try {
      const {data: {ads}} = await profileApiClient.getRemovedAds();
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

  handleRecover = (id) => {
    const {ads} = this.state;
    adApiClient.recoverAd(id)
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
        return <ProfileAdBox key={index} {...ad} handleRecover={this.handleRecover} isRecover={true}/>;
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
                  <p>¡No tienes anuncios eliminados!</p>
                  <Link to={'/ads'} className={'button-bck-purple'}>Volver a mis anuncios</Link>
                </div>}
            </div>
          </div>)}
      </React.Fragment>
    )
  }
}

export default RecoverAds;