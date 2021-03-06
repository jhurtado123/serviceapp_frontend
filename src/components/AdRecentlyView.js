import React, { Component } from 'react';
import profileApiClient from "../services/apiManager/profile";
import SmallAd from "../components/SmallAd";
import SmallLoadingBars from "./SmallLoadingBars";

const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};


class AdRecentlyView extends Component {
  state = {
    recently_viewed: [],
    status: STATUS.LOADING,
  }
  
  componentDidMount = () => {
    this.getAdsViewed()
  }

  async getAdsViewed () {
    try{
      const { data: {recently_viewed} }  = await profileApiClient
        .getProfile();
      this.setState({
        recently_viewed,
        status: STATUS.LOADED, 
      })
    } 
    catch(error){
    }
  }

  displayAdsViewed = () => {
    const { recently_viewed } = this.state;
    if (recently_viewed.length) {
      return recently_viewed.map((ad, i) => {
        return <SmallAd ad={ad} key={i} />
      })
    }
    return <span className={'no-ads-viewed'}> No has vistos anuncios</span>
  }

  render(){
    const { status } = this.state;

    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADING:
        return <SmallLoadingBars />;
      case STATUS.LOADED:
        return (
          <div className="ads-container recently-viewed">
          {this.displayAdsViewed()}
          </div>
        )
    }
  }
}

export default AdRecentlyView; 