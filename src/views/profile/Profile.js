import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from "../../context/AuthContext";
import profileApiClient from "../../services/apiManager/profile";
import adApiClient from "../../services/apiManager/ad";
import HeaderProfile  from "../../components/HeaderProfile";
import AdLink from "../../components/AdLink";
import ReviewUser from "../../components/ReviewUser";
import '../../assets/css/views/profile/Profile.scss';


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
    ads: [],
    reviews:[],
    showReviews: false,
  }

  componentDidMount = () => {
    this.loadProfile()
    this.getLevel()
  }
  
  loadProfile = () => {
    profileApiClient
    .getProfile()
    .then(({ data } ) => {
      console.log("El data es", data)
      this.setState({
        _id: data._id,
        name: data.name,
        username: data.username,
        postalcode: data.postalcode,
        points: data.points,
        tokens: data.tokens,
        reviews: data.review,
      })
      })
      .catch((error) => {
        console.log(error);
      })
    adApiClient
      .getAdsFromUser()
      .then(({ data }) => {
        this.setState({
          ads: data,
        })
      })
      .catch((error) => console.log(error))      
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
      .catch((error) => console.log(error))
  }

  getAdsFromUser = () => {
    const { ads } = this.state;
    return ads.map((ad, i) => {
      return (
        <AdLink 
          key={i}
          name={ad.name}
          price={ad.price}
          img={ad.images[0]}
        />
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
    const { name, level, points, missingpoints, tokens, showReviews} = this.state;
    return(
      <div>
        <HeaderProfile name={name} level={level} points={points} missingpoints={missingpoints} tokens={tokens} />
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