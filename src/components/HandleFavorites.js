import React, {Component} from 'react';
import {ReactComponent as FavoriteIcon} from '../assets/images/icons/favorites.svg'
import '../assets/css/components/favorites.scss'
import {withAuth} from "../context/AuthContext";
import favoritesApiClient from "../services/apiManager/favorites";

class HandleFavorites extends Component {

  state = {
    isFavorite: this.props.isFavorite,
  };

  handleClick = () => {
    const {isFavorite} = this.state;
    isFavorite ? this.removeFromFavorites() : this.addTofavorites();
    return;
  };

  addTofavorites = async () => {
    const {adId, user} = this.props;
    try {
      await favoritesApiClient.addFavorite(adId);
      user.favorites.push(adId);
      this.setState({
        isFavorite: true,
      })
    } catch (e) {
      console.log(e);
    }
  };

  removeFromFavorites = async () => {
    const {adId, user} = this.props;
    try {
      await favoritesApiClient.removeFromFavorites(adId);
      user.favorites = user.favorites.filter(favorite => favorite !== adId);
      this.setState({
        isFavorite: false,
      })
    } catch (e) {}
  };



  render() {
    const {isFavorite} = this.state;
    return (
      <FavoriteIcon onClick={this.handleClick} className={'favorites-icon '  + (isFavorite ? 'is-favorite' : '')}/>
    );
  }
}

export default withAuth(HandleFavorites);