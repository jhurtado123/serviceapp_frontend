import React, {Component} from 'react';
import {withAuth} from "../../context/AuthContext";
import profileApiClient from "../../services/apiManager/profile";
import adApiClient from "../../services/apiManager/ad";
import HeaderProfile from "../../components/HeaderProfile";
import AdBox from "../../components/AdBox";
import ReviewUser from "../../components/ReviewUser";
import '../../assets/css/views/profile/Profile.scss';
import REDIRECT from "../../errorRedirects";
import LoadingBars from "../../components/LoadingBars";
import BaseLayout from "../layouts/BaseLayout";

const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class Profile extends Component {
  state = {
    _id: "",
    name: "",
    username: "",
    postalcode: "",
    points: 0,
    tokens: 0,
    level: 0,
    totalpoints: 0,
    reward:0,
    missingpoints: 0,
    images: [],
    url: '',
    ads: [],
    reviews: [],
    showReviews: false,
    status: STATUS.LOADING,
  }

  async componentDidMount () {
    await this.loadProfile()
    await this.getLevel()
    await this.getMissingPoints()
  }

  async loadProfile() {
    try {
      const {data} = await profileApiClient
        .getProfile()
      this.setState({
        _id: data._id,
        name: data.name,
        username: data.username,
        postalcode: data.postalcode,
        points: data.points,
        tokens: data.wallet.tokens,
        reviews: data.review,

      })
      const ads = await adApiClient
        .getAdsFromUser()
      this.setState({
        ads,
      })

    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
    ;
  }

  async getLevel() {
    const { points } = this.state;
    if (points !== 0) {
      try {
        const { data } = await profileApiClient
          .getLevel()
        this.setState({
          level: data[0].level,
          totalpoints: data[0].maxpoints,
          reward: data[0].reward,
          status: STATUS.LOADED,
        })
      }
      catch (error) {
        if (error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      }
    }
  }

  getOneImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
    return url;
  }

  getAdsFromUser = () => {
    const {ads: {data}} = this.state;
    if (typeof data !== 'undefined' && data.length > 0) {
      return data.map((ad, i) => {
        return (
          <AdBox
            key={i}
            ad={ad}
          />
        )
      })
    } else {
      return <p className="not-info">No tiene anuncios activos</p>
    }
  }

  getMissingPoints = () => {
    const {points, totalpoints} = this.state;
    let result = totalpoints - points;
    this.setState({
      missingpoints: result,
    })

  }

  handleServices = () => {
    this.setState({
      showReviews: false,
    })
  }

  handleReviews = () => {
    this.setState({
      showReviews: true,
    })
  }

  getReviewsFromUser = () => {
    const {reviews} = this.state;
    if (typeof reviews !== 'undefined' && reviews.length > 0) {
      return reviews.map((review, i) => {
        return <ReviewUser key={i} user={review.user} content={review.content} rating={review.rating}/>
      })
    } else {
      return <p className="not-info">No tienes reviews</p>
    }
  }


  render() {
    const {name, level, url, points, reward, missingpoints, tokens, showReviews, status} = this.state;
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADED:
        return (
          <BaseLayout>
          <div>
            <HeaderProfile name={name} level={level} reward={reward} url={url} points={points} missingpoints={missingpoints}
                          tokens={tokens}/>
            {showReviews ?
              <div className={'container'}>
                  <button className={'button-user button-user-not'} onClick={this.handleServices}>Servicios</button>
                  <button className={'button-user'} onClick={this.handleReviews}>Reviews</button>
                {this.getReviewsFromUser()}
              </div> :
              <div className={'container'}>
                  <button className={'button-user'} onClick={this.handleServices}>Servicios</button>
                  <button className={'button-user button-user-not'} onClick={this.handleReviews}>Reviews</button>
                {this.getAdsFromUser()}
              </div>
            }
          </div>
          </BaseLayout>
        )
      case STATUS.LOADING:
        return (
          <BaseLayout>
            <div>
              <LoadingBars/>
            </div>
          </BaseLayout>
        )
    }
  }
}

export default withAuth(Profile);