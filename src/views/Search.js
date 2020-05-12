import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import SearchBarWithFilters from "../components/SearchBarWithFilters";
import '../assets/css/views/search.scss';
import searchApiClient from "../services/apiManager/search";
import AdBox from "../components/AdBox";
import mapboxgl from "mapbox-gl";
import {withAuth} from "../context/AuthContext";

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let markers = [];

class Search extends Component {

  state = {
    search: '',
    maxRadius: 1,
    maxPrice: '',
    ads: [],
    orderBy: 'distance',
    category: '',
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      this.searchFromState();
    });
  };

  componentDidMount() {
    const {user} = this.props;
    console.log(user);
    this.searchFromState();
    map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
     // center: [lat, lng],
      zoom: 14,
      interactive: false,
      scrollZoom: false,
    });
  }


  searchFromState = async () => {
    try {
      const ads = await searchApiClient.search(this.state);
      this.setState({
        ads: ads.data,
      })
    }
    catch (e) {

    }
  };

  printAds = (e) => {
    const {ads} = this.state;
    if (ads.length) {
      return ads.map((ad, index) => <AdBox key={index} ad={ad}/>)
    }
    return <div className={'page-message'}>No hay anuncios disponibles para esta búsqueda.</div>
  };

  render() {
    console.log(this.props);
    return (
      <BaseLayout>

        <SearchBarWithFilters placeholder={'Buscar'} handleChange={this.handleChange} {...this.state}/>

        <div className={'container search-container'}>
          {this.printAds()}
        </div>
        <div className={'search-container-map'}>
          <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
        </div>
      </BaseLayout>
    );
  }
}

export default withAuth(Search);