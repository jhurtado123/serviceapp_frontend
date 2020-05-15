import React, {Component} from 'react';
import adApiClient from "../../services/apiManager/ad";
import Loading from "../Loading";
import '../../assets/css/views/ad/view.scss'
import Token from '../../assets/images/icons/coin.png';
import Location from '../../assets/images/icons/location.png';
import Tags from '../../assets/images/icons/tags.png';
import Category from '../../assets/images/icons/category.png';
import mapboxgl from "mapbox-gl";
import ProfileImage from "../../components/ProfileImage";
import SmallAd from "../../components/SmallAd";
import {Sticky, StickyContainer} from 'react-sticky';
import REDIRECT from "../../errorRedirects";
import AdImages from "../../components/AdImages";
import chatApiClient from "../../services/apiManager/chat";

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;


class AdView extends Component {

  state = {
    isLoading: true,
    ad: undefined,
    isMapOpened: false,
    relatedAds: [],
  };

  handleOpenMap = () => {
    this.setState({
      isMapOpened: !this.state.isMapOpened,
    })
  };

  handleChatInit = async () => {
    const {ad} = this.state;

    if (!ad) return;

    try {
      const {data} = await chatApiClient.createChat(ad._id);
      this.props.history.push(`/chats/${data.data}`);
    } catch (e) {
      return;
    }
  };

  printAdTags = () => {
    const {ad: {tags}} = this.state;
    return tags.map((tag, index) => tag && <div className={'tag'} key={index}>{tag}</div>);
  };

  printRelatedAds = () => {
    const {relatedAds} = this.state;
    if (relatedAds.length) {
      return relatedAds.map((relatedAd, index) => <SmallAd ad={relatedAd} key={index}/>);
    }
    return <div className={'no-related-ads'}>No hay servicios relacionados</div>
  };

  async componentDidMount() {
    this.getAdData();
  }

  getAdData = async () => {
    try {
      const {match: {params: {id}}} = this.props;
      const {data: {ad, relatedAds}} = await adApiClient.getAdWithRelated(id);
      this.setState({
        ad,
        relatedAds,
        isLoading: false,
      }, () => {
        const {ad: {location: {coordinates}}} = this.state;
        map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [coordinates[0], coordinates[1]],
          zoom: 14,
          interactive: true,
          scrollZoom: false,
        });
        marker = new mapboxgl.Marker()
          .setLngLat([coordinates[0], coordinates[1]])
          .addTo(map);
      })
    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location.key !== this.props.location.key) {
      this.setState({
        isLoading: true,
      });
      this.getAdData();
    }
  }

  componentWillUnmount() {
    if (map) map.remove();
  }

  render() {
    const {ad, isLoading, isMapOpened} = this.state;
    return (
      <React.Fragment>
        {isLoading ? <Loading/> :
          <div className={'ad'}>
            <div className={'ad-images'}>
              <AdImages ad={ad}/>
            </div>
            <StickyContainer>
              <Sticky>
                {({
                    style,
                  }) => (
                  <div className={'ad-owner'} style={style}>
                    <div className={'owner-profile'}>
                      <ProfileImage user={ad.owner}/>
                      <div className={'owner-data'}>
                        <h3>{ad.owner.name}</h3>
                        <p>Level: 5 <span>★★★★</span></p>
                      </div>
                    </div>
                    <div className={'ad-chat-button'} onClick={this.handleChatInit}>
                      Iniciar chat
                    </div>
                  </div>
                )}
              </Sticky>
              <div className={'container'}>
                <div className={'ad-header'}>
                  <h1>{ad.name}</h1>
                  <div className={'ad-price'}>
                    {ad.price} <img src={Token} alt=""/>
                  </div>
                </div>
                <div className={'ad-location'}>
                  <img src={Location} alt=""/> Barcelona, <span>08060</span>
                </div>
                <div className={'ad-description'}>
                  <p>{ad.description}</p>
                </div>
                <div className={'ad-see-map-button'}>
                  <div className={'see-map-button'}
                       onClick={this.handleOpenMap}>{isMapOpened ? 'Cerar mapa' : 'Ver mapa'}</div>
                </div>
              </div>
              <div className={'map ' + (isMapOpened ? ' open' : '')}>
                <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
              </div>
              <div className={'container'}>
                <div className={'form-title'}><img src={Category}/>Categoría</div>
                <div className={'ad-category'}>
                  {ad.category.name}
                </div>

                <div className={'form-title'}><img src={Tags}/>Etiquetas</div>
                <div className={'ad-tags'}>
                  {this.printAdTags()}
                </div>
                <div className={'form-title'}>Servicios relacionados</div>
                <div className={'ad-related'}>
                  {this.printRelatedAds()}
                </div>
              </div>
            </StickyContainer>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default AdView;