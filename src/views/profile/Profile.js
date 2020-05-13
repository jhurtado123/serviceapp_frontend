import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from "../../context/AuthContext";
import profileApiClient from "../../services/apiManager/profile";
import adApiClient from "../../services/apiManager/ad";
import HeaderProfile  from "../../components/HeaderProfile";
import AdLink from "../../components/AdLink";
import ReviewUser from "../../components/ReviewUser";
import Loading from "../Loading";
import '../../assets/css/views/profile/Profile.scss';
import REDIRECT from "../../errorRedirects";


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
    missingpoints: 0,
    images: [],
    url: '', 
    ads: [],
    reviews:[],
    showReviews: false,
    isLoading: false, 
  }

  componentDidMount = () => {
    this.loadProfile()
    this.getLevel()
  }
  
  async loadProfile () {
    try{
      const { data } = await profileApiClient
      .getProfile()
        this.setState({
          _id: data._id,
          name: data.name,
          username: data.username,
          postalcode: data.postalcode,
          images: await this.getImages([data.profile_image], data._id),
          points: data.points,
          tokens: data.tokens,
          reviews: data.review,
          isLoading: false,
        })
        
      }
      catch(error) {
        if (error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      };
    adApiClient
      .getAdsFromUser()
      .then(({ data }) => {
        this.setState({
          ads: data,
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

  getLevel = () => {
    profileApiClient
      .getLevel()
      .then(({ data }) =>{
        this.setState({
          level: data[0].level,
          totalpoints: data[0].maxpoints
        })
        this.getMissingPoints()
      })
      .catch((error) => {
        if (error.response) {
          this.props.history.push(REDIRECT[error.response.status]);
          return;
        }
        this.props.history.push(REDIRECT[500]);
      })
  }

  async getImages(images, id) {
    let responseFiles = [];
    images.map(async (image) => {
      const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/profile/${id}/${image}`;
      let response = await fetch(url);
      let data = await response.blob();
      let metadata = {
        type: 'image/*'
      };
      this.setState({
        url: url,
      })
      responseFiles.push(new File([data], image, metadata));
    });
    return responseFiles;
  } 

  getOneImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
    return url; 
  }

  getAdsFromUser = () => {
    const { ads } = this.state;
    return ads.map((ad, i) => {
      let url = this.getOneImage(ad.image, ad._id)
      return (
        <Link key={i} to={`/ad/${ad._id}`}>
          <AdLink 
            key={i}
            name={ad.name}
            price={ad.price}
            img={ad.images[0]}
            url={url}
          />
        </Link>
      )
    })
  }

  getMissingPoints  = () => {
    const { points, totalpoints } = this.state;
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
    const { reviews } = this.state;
    return reviews.map((review, i) => {
      return <ReviewUser key={i} content={review.content} rating={review.rating} />
    })
  }

    render() {
    const { name, level, url, points, missingpoints, tokens, showReviews, isLoading} = this.state;
    return(
      <div>
      {
          isLoading ? <Loading /> :
        <HeaderProfile name={name} level={level} url={url} points={points} missingpoints={missingpoints} tokens={tokens} />
      }
        {showReviews ? 
        <div>
          <button className="ButtonUser ButtonUserNot" onClick={this.handleServices}>Services</button>
          <button className="ButtonUser" onClick={this.handleReviews}>Reviews</button>
          {this.getReviewsFromUser()}
        </div> :
        <div>
          <button className="ButtonUser" onClick={this.handleServices}>Services</button>
          <button className="ButtonUser ButtonUserNot" onClick={this.handleReviews}>Reviews</button>
          {this.getAdsFromUser()}
        </div>}
      </div>
    )
  }
}

export default withAuth(Profile);