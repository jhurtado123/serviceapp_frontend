import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import SearchBarWithFilters from "../components/SearchBarWithFilters";
import '../assets/css/views/search.scss';
import searchApiClient from "../services/apiManager/search";
import AdBox from "../components/AdBox";
import mapboxgl from "mapbox-gl";
import {withAuth} from "../context/AuthContext";
import {withRouter} from 'react-router-dom';
import LoadingBars from "../components/LoadingBars";

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let markers = [];

class Search extends Component {

  stateFromHome = this.props.location.state;

  state = {
    search: this.stateFromHome ? this.stateFromHome.search : '',
    maxRadius: this.stateFromHome ? this.stateFromHome.maxRadius : 10,
    maxPrice: this.stateFromHome ? this.stateFromHome.maxPrice : '',
    ads: [],
    orderBy: this.stateFromHome ? this.stateFromHome.orderBy : 'distance',
    category: this.stateFromHome ? this.stateFromHome.category : '',
    isMapShown: false,
    isLoading: true,
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
    this.searchFromState();
    const pulsingDot = this.getPulsingDot(100);
    const coordinates = user ? [user.location.coordinates[0], user.location.coordinates[1]] : [2.1648800, 41.3922500];
    map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: coordinates,
      zoom: 13,
      interactive: true,
      scrollZoom: true,
      isLoading: false,
    });
    map.on('load', function () {
      map.addImage('pulsing-dot', pulsingDot, {pixelRatio: 2});

      map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': coordinates,
              }
            }
          ]
        }
      });
      map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    });
    map.resize();
  }

  getPulsingDot(size) {
    return {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(240, 200, 8,' + (1 - t) + ')';
        context.fill();

        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = '#F0C808';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        map.triggerRepaint();
        return true;
      }
    };
  }

  searchFromState = async () => {
    this.setState({
      isLoading:true,
    });
    try {
      const ads = await searchApiClient.search(this.state);
      this.setState({
        ads: ads.data,
        isLoading:false,
      });
      this.addMarkers(ads.data);

    } catch (e) {

    }
  };

  addMarkers = (ads) => {
    this.removeMarkers();
    ads.forEach(ad => {
      const popup = new mapboxgl.Popup({offset: 15})
        .setHTML(`<span data-id="${ad._id}">${ad.name}</span>`);

      markers.push(new mapboxgl.Marker()
        .setLngLat([ad.location.coordinates[0], ad.location.coordinates[1]])
        .setPopup(popup)
        .addTo(map));

      popup.on('open',  (e) => {
        const target =  e.target._content.lastChild;
        const urlId = target.getAttribute('data-id');
        target.addEventListener('click', () => {
          this.props.history.push(`/ad/${urlId}`);
        });
      });
    });
    map.resize();
  };

  removeMarkers() {
    markers.forEach(marker => {
      marker.remove();
    });
    markers = [];
  }

  componentWillUnmount() {
    map.remove();
  }

  handleViewMap = () => {
    this.setState({
      isMapShown: true
    }, () => {
      map.resize();
    });
  };
  handleViewList = () => {
    this.setState({
      isMapShown: false
    });
  };

  printAds = (e) => {
    const {ads} = this.state;
    if (ads.length) {
      return ads.map((ad, index) => <AdBox key={index} ad={ad}/>)
    }
    return <div className={'page-message'}>No hay anuncios disponibles para esta búsqueda.</div>
  };

  render() {
    const {isMapShown, isLoading} = this.state;
    return (
      <BaseLayout>
        <SearchBarWithFilters placeholder={'Buscar'} handleChange={this.handleChange} {...this.state}/>
        <div className={'view-options container'}>
          <div className={'view-option ' + (!isMapShown ? 'active' : '')} onClick={this.handleViewList}>Lista</div>
          <div className={'view-option ' + (isMapShown ? 'active' : '')} onClick={this.handleViewMap}>Mapa</div>
        </div>
        <div className={'search-view container search-container ' + (!isMapShown ? 'show ' : 'hide ') + (isLoading ? ' loading' : '')}>
          {isLoading ? <LoadingBars/> : this.printAds()}
        </div>
        <div className={'search-view search-container-map map ' + (isMapShown ? 'show' : 'hide')}>
          <div ref={el => this.mapContainer = el} className={'mapContainer'} style={{width:'100vw', height:'100vh'}}/>
        </div>
      </BaseLayout>
    );
  }
}

export default withRouter(withAuth(Search));