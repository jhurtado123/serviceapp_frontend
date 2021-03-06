import React, { Component } from 'react';
import { withAuth } from "../../context/AuthContext";
import profileApiClient from "../../services/apiManager/profile";
import adApiClient from "../../services/apiManager/ad";
import HeaderProfileOtherUser from "../../components/HeaderProfileOtherUser";
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

class ProfileOtherUser extends Component {
  state = {
    _id: "",
    name: "",
    username: "",
    postalcode: "",
    points: 0,
    level: 0,
    totalpoints: 0,
    missingpoints: 0,
    images: [],
    url: '',
    ads: [],
    reviews: [],
    showReviews: false,
    user: {},
    status: STATUS.LOADING,
  }

  componentDidMount = () => {
    this.loadProfile()
    this.getLevel()
  };

  async loadProfile() {
    try {
      const { match: { params: { username } } } = this.props;

      const { data: { user } } = await profileApiClient
        .getProfileOtherUser(username);
      let theUser = user[0];
      this.setState({
        _id: theUser._id,
        name: theUser.name,
        username: theUser.username,
        description: theUser.description,
        postalcode: theUser.postalcode,
        points: theUser.points,
        reviews: theUser.review,
        user: theUser,
      });
      this.getAdsOtherUser()
    }
    catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    };
  }

  getLevel = () => {
    profileApiClient
      .getLevel()
      .then(({ data }) => {
        this.setState({
          level: data[0].level,
          totalpoints: data[0].maxpoints
        })
      })
      .catch((error) => {
        if (error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      })
  }

  getOneImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
    return url;
  }

  async getAdsOtherUser () {
    const { _id } = this.state
    const adsUser = await adApiClient
      .getAdsOtherUser(_id)
    this.setState({
      ads: adsUser.data,
      status: STATUS.LOADED,
    })
  }

  printAdsUser = () => {
    const { ads } = this.state;
    if (typeof ads !== 'undefined' && ads.length > 0) {
      return ads.map((ad, i) => {
        return (
          <AdBox
            key={i}
            ad={ad}
          />
        )
      })
    }
    else {
      return <p className="not-info"> Este usuario no tiene anuncios activos</p>
    }
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
    const { reviews } = this.state;
    if (typeof reviews !== 'undefined' && reviews.length > 0) {
      return reviews.map((review, i) => {
        return <ReviewUser key={i} user={review.user} content={review.content} rating={review.rating} />
      })
    } else {
      return <p className="not-info">Este usuario tiene reviews</p>
    }
  }

  render() {
    const { name, level, _id, points, user, description, tokens, showReviews, status } = this.state;
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADED:
        console.log("El id", _id)
        return (
          <BaseLayout>
          <div>
            <HeaderProfileOtherUser name={name} level={level} user={user} points={points} description={description} tokens={tokens} />
            {showReviews ?
              <div className={'container'}>
                <button className={'button-user button-user-not'} onClick={this.handleServices}>Servicios</button>
                <button className={'button-user'} onClick={this.handleReviews}>Reviews</button>
                {this.getReviewsFromUser()}
              </div> :
                <div className={'container'}>
                <button className={'button-user'} onClick={this.handleServices}>Servicios</button>
                <button className={'button-user button-user-not'} onClick={this.handleReviews}>Reviews</button>
                {this.printAdsUser()}
              </div>
            }
          </div>
          </BaseLayout>
        )
      case STATUS.LOADING:
        return (
          <div>
            <LoadingBars />
          </div>
        )
    }
  }
}

export default withAuth(ProfileOtherUser);