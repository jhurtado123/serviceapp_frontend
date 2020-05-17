import React, { Component } from 'react';
import searchApiClient from "../services/apiManager/search";
import SmallAd from "../components/SmallAd";
import SmallLoading from "../components/SmallLoading"; 
import '../assets/css/views/home.scss';

const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class BestAds extends Component {

  state = {
    search: '',
    maxRadius: 10,
    maxPrice:  '',
    ads: [],
    orderBy:'distance',
    category: '',
    status: STATUS.LOADING,

  };

  
  componentDidMount = () => {
    this.setLocation()
    this.getData()
  }

  setLocation = () => {
    const { stateFromHome} = this.props;
    this.setState({
      search: stateFromHome ? stateFromHome.search : '',
      maxRadius: stateFromHome ? stateFromHome.maxRadius : 10,
      maxPrice: stateFromHome ? stateFromHome.maxPrice : '',
      ads: [],
      orderBy: stateFromHome ? stateFromHome.orderBy : 'distance',
      category: stateFromHome ? stateFromHome.category : '',
    })
  }
  async getData () {
    try {
      const ads = await searchApiClient.search(this.state);
      this.setState({
        ads: ads.data,
          status: STATUS.LOADED,
      });
    } catch (e) {
      
    }
  }

  printBestAds = () => {
    const { ads } = this.state;
    if (ads.length) {
      let bestAds = [];
      for (let i = 0; i < 6; i++) {
        const ad = ads[i];
        bestAds.push(ad)
      }
      return bestAds.map((ad, i) => {
        return <SmallAd ad={ad} key={i} />
      })
    }
    return <div className={'no-related-ads'}>No hay anuncios mejor valorados</div>
  };

  render(){
    const { status } = this.state; 
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADING:
        return (
          <div>
            <SmallLoading />
          </div>
        )
      case STATUS.LOADED:
        return (
          <div>
            <div className="ads-container">
              {this.printBestAds()}
            </div>
          </div>
        )
    }
  }
}

export default BestAds;
