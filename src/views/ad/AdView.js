import React, {Component} from 'react';
import adApiClient from "../../services/apiManager/ad";
import profileApiClient from "../../services/apiManager/profile";
import '../../assets/css/views/ad/view.scss'
import Token from '../../assets/images/icons/coin2.png';
import Back from '../../assets/images/icons/back-white.png';
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
import {withAuth} from "../../context/AuthContext";
import Modal from "../../components/Modal";
import {Link} from "react-router-dom";
import LoadingBars from "../../components/LoadingBars";
import HandleFavorites from "../../components/HandleFavorites";
import ReviewUserAverage from "../../components/ReviewUserAverage";

mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;


class AdView extends Component {

  state = {
    isLoading: true,
    ad: undefined,
    isMapOpened: false,
    relatedAds: [],
    showModaNoTokens:false,
    ownerLevel: 0,
  };

  handleOpenMap = () => {
    this.setState({
      isMapOpened: !this.state.isMapOpened,
    })
  };

  handleChatInit = async () => {
    const {ad} = this.state;
    const {user} = this.props;

    if (!ad) return;
    if (!user.wallet.tokens) {
      this.setState({
        showModaNoTokens: true,
      });
      return;
    }

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
    this.addRecentlyViewed();
  }

  handleModalClose = () => {
    this.setState({
      showModaNoTokens: false,
    });
  };

  getAdData = async () => {
    try {
      const {match: {params: {id}}} = this.props;
      const {data: {ad, relatedAds}} = await adApiClient.getAdWithRelated(id);
      this.setState({
        ad,
        relatedAds,
        isLoading: false,
      }, async () => {
        const {ad: {location: {coordinates}}} = this.state;
        const {data: {level}} = await profileApiClient.getUserLevel(this.state.ad.owner._id);
        this.setState({
          ownerLevel: level
        });
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

  addRecentlyViewed = () => {
    const {match: {params: {id}}} = this.props;
    profileApiClient.addToRecentlyViewed(id);
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
    const {history, user} = this.props;
    const {ad, isLoading, isMapOpened, showModaNoTokens, ownerLevel} = this.state;
    return (
      <React.Fragment>
        {isLoading ? <LoadingBars/> :
          <div className={'ad'}>
            <div className={'ad-images'}>
              <div className={'back'}>
                <img src={Back} alt="" onClick={history.goBack}/>
              </div>
              <div className={'add-favorites'}>
                <HandleFavorites adId={ad._id} isFavorite={user.favorites.includes(ad._id)}/>
              </div>
              <AdImages ad={ad}/>
            </div>
            <StickyContainer>
              <Sticky>
                {({
                    style,
                  }) => (
                  <Link to={`/profile/user/${ad.owner.username}`} className={'ad-owner'} style={style}>
                    <div className={'owner-profile'}>
                      <ProfileImage user={ad.owner}/>
                      <div className={'owner-data'}>
                        <h3>{ad.owner.name}</h3>
                        <p>Level: {ownerLevel} <ReviewUserAverage user={ad.owner}/> </p>
                      </div>
                    </div>
                    {
                      user._id == ad.owner._id ?
                        <Link className={'ad-chat-button'} to={`/ad/${ad._id}/edit`}>
                          Editar anuncio
                        </Link>
                        :
                        <div className={'ad-chat-button'} onClick={this.handleChatInit}>
                          Iniciar chat
                        </div>
                    }
                  </Link>
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
                       onClick={this.handleOpenMap}>{isMapOpened ? 'Cerrar mapa' : 'Ver mapa'}</div>
                </div>
              </div>
              <div className={'map ' + (isMapOpened ? ' open' : '')}>
                <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
              </div>
              <div className={'container'}>
                <div className={'form-title'}><img src={Category} alt="category"/>Categoría</div>
                <div className={'ad-category'}>
                  {ad.category.name}
                </div>

                <div className={'form-title'}><img src={Tags} alt="tags"/>Etiquetas</div>
                <div className={'ad-tags'}>
                  {this.printAdTags()}
                </div>
                <div className={'form-title'}>Servicios relacionados</div>
                <div className={'ad-related'}>
                  {this.printRelatedAds()}
                </div>
              </div>
            </StickyContainer>
            <Modal show={showModaNoTokens} title={'No puedes iniciar el chat'} handleClose={this.handleModalClose}>
              <div className={'info-message'}>
                Para iniciar el chat debes tener al menos 1 serken en tu cartera.
                <p>Puedes ofrecer tus servicios para conseguir serkens o puedes comprarlos <Link to={'/buySerkens'}>aquí</Link></p>
              </div>
            </Modal>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default withAuth(AdView);