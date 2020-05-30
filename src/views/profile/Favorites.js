import React, {Component} from 'react';
import HeaderWithTitle from "../../components/HeaderWithTitle";
import favoritesApiClient from "../../services/apiManager/favorites";
import REDIRECT from "../../errorRedirects";
import LoadingBars from "../../components/LoadingBars";
import SearchBar from "../../components/SearchBar";
import {Link} from "react-router-dom";
import '../../assets/css/views/profile/favorites.scss';
import AdBox from "../../components/AdBox";

class Favorites extends Component {

  state = {
    favorites: [],
    isLoading:true,
    search: '',
  };

  async componentDidMount() {
    try {
      const {data: {favoritesUser}} = await favoritesApiClient.getFavorites();
      this.setState({
        favorites: favoritesUser.favorites,
        isLoading: false,
      })
    } catch (e) {
      this.props.history.push(REDIRECT[500]);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  printFavorites = () => {
    const {favorites, search} = this.state;
    return favorites.map((favoriteAd, index) => {
      if ((search && favoriteAd.name.includes(search)) || !search) {
        return <AdBox ad={favoriteAd} key={index}/>
      }
      return false;
    });
  };

  render() {
    const {favorites, isLoading, search} = this.state;
    return (
      <div>
        <HeaderWithTitle title={'Tus favoritos'}/>
        <SearchBar searchValue={search} handleChange={this.handleChange} placeholder={'Buscar anuncios'}/>
        {isLoading ?
          <LoadingBars/> :
          favorites.length ?
            <div className={'favorites-list container'}>
              {this.printFavorites()}
            </div>
            :
            <div className={'page-message container'}>
              <p>¡No tienes ningún anuncio en favoritos!</p>
              <Link to={'/'} className={'button-bck-purple'}>Volver a la home</Link>
            </div>
        }
      </div>
    );
  }
}

export default Favorites;