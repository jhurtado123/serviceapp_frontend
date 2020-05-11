import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import SearchBarWithFilters from "../components/SearchBarWithFilters";
import '../assets/css/views/search.scss';

class Search extends Component {

  state = {
    search: '',
    maxRadius: 1,
    maxPrice: 10000,
    ads: [],
    orderBy: 'distance',
    category: '',
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(this.state);
  };

  printAds = (e) => {
    const {ads} = this.state;
    if (ads.length) {
      return ads.map((ad, index) => <div key={index}>{ad.name}</div>)
    }
    return <div className={'page-message'}>No hay anuncios disponibles para esta búsqueda.</div>
  };

  render() {
    return (
      <BaseLayout>

        <SearchBarWithFilters placeholder={'Buscar'} handleChange={this.handleChange} {...this.state}/>

        <div className={'container search-container'}>
          {this.printAds()}
        </div>
      </BaseLayout>
    );
  }
}

export default Search;