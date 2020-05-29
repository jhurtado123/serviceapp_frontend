import React, { Component } from 'react';
import { withAuth } from "../../context/AuthContext";
import HeaderProfile from "../../components/HeaderProfile";
import profileApiClient from "../../services/apiManager/profile";
import REDIRECT from "../../errorRedirects";
import BaseLayout from "../layouts/BaseLayout";
import LoadingBars from "../../components/LoadingBars";
import Reward from "../../components/Reward";
import "../../assets/css/views/profile/rewards.scss";





const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class Rewards extends Component {
  state = {
    _id: "",
    name: "",
    username: "",
    description: "",
    address: "",
    profile_image: "",
    postalcode: "",
    ads: 0,
    points: 0,
    tokens: 0,
    level: 0,
    totalpoints: 0,
    missingpoints: 0,
    totalads: 0,
    totalpointsads: 0,
    progress: 0,
    pending: 0, 
    status: STATUS.LOADING,
  }

  async componentWillMount () {
    await this.loadProfile()
    await this.getAds()
    await this.getRewardsAds()
    await this.getProgress()
    await this.getLevel()
  }

  componentDidMount = () => {

  }
  async loadProfile() {
    try {
      const { data } = await profileApiClient
        .getProfile()
      this.setState({
        _id: data._id,
        name: data.name,
        username: data.username,
        postalcode: data.postalcode,
        description: data.description,
        address: data.address,
        profile_image: data.profile_image,
        points: data.points,
        tokens: data.wallet.tokens,
        reviews: data.review,
      })
    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }

  }

  async getLevel () {
    const { points } = this.state;
    if (points !== 0) {
      try{
        const {data } = await profileApiClient
          .getLevel()
        this.setState({
            level: data[0].level,
            totalpoints: data[0].maxpoints,
            })
        this.getMissingPoints()        
      }
      catch (error) {
        if(error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      }
    }
  }

  getMissingPoints = () => {
    const { points, totalpoints } = this.state;
    let result = totalpoints - points;
    this.setState({
      missingpoints: result,
    })

  }

  async getAds () {
    const {data: {ads}} = await profileApiClient.getAds()
    this.setState({
      ads: ads.length,
    })
  }

  async getRewardsAds () {
    const {data} = await profileApiClient.getRewardsAds()
    this.setState({
      totalads: data.total,
      totalpointsads: data.points
    })
  }
  
  getProgress = () => {
    const { ads, totalads } = this.state;
    let pendingAds = totalads - ads; 
    this.setState({
      progress: (ads / totalads) * 100,
      pending: pendingAds,
      status: STATUS.LOADED
    })
  }

  checkRewardProfile = () => {
    const { name, description, address, profile_image, postalcode } = this.state; 
    if (name !== '' && description !== '' && address !== '' && profile_image !=='' && postalcode !==''){
      return <Reward title="Completar tu perfil" points="10" progress="100" status="Completado" />
    } else {
      return <Reward title="Completar tu perfil" points="10" progress="0" status="Te falta por rellenar tu perfil" />
    }
  }
  

  render(){
    const { name, level, url, points, missingpoints, tokens, status, totalpointsads, progress, pending } = this.state;

    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADED:
        return (
          <BaseLayout>
            <div>
              <HeaderProfile name={name} level={level} url={url} points={points} missingpoints={missingpoints}
                tokens={tokens} />
            </div>
            <div className={'rewards-container'}>
              {this.checkRewardProfile()}
              <Reward title="Publicar anuncios" points={totalpointsads} progress={progress} status={`Te falta ${pending} anuncios`} /> 
            </div>
            
          </BaseLayout>
        )
      case STATUS.LOADING:
        return (
          <BaseLayout>
            <div>
              <LoadingBars />
            </div>
          </BaseLayout>
        )
    }
  }
}
export default withAuth(Rewards);