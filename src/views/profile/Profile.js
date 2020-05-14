import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from "../../context/AuthContext";
import profileApiClient from "../../services/apiManager/profile";
import adApiClient from "../../services/apiManager/ad";
import HeaderProfile  from "../../components/HeaderProfile";
import AdBox from "../../components/AdBox";
import ReviewUser from "../../components/ReviewUser";
import Loading from "../Loading";
import '../../assets/css/views/profile/Profile.scss';
import REDIRECT from "../../errorRedirects";

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
    missingpoints: 0,
    images: [],
    url: '', 
    ads: [],
    reviews:[],
    showReviews: false,
    status: STATUS.LOADING,
  }

  componentDidMount = () => {
    this.loadProfile()
    this.getLevel()
  }
  
  async loadProfile () {
    try{
      const {data} = await profileApiClient
      .getProfile()
<<<<<<< HEAD
      console.log(data)
=======
>>>>>>> 40905a38db6af7d4b8f93976cefdab469c8e3c72
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
              status: STATUS.LOADED,
            })
        
      }
<<<<<<< HEAD
    catch(error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    };
  }
=======
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
>>>>>>> 40905a38db6af7d4b8f93976cefdab469c8e3c72

  getLevel = () => {
    const { points } = this.state;
    console.log(points)
    if(points !==0){
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
          console.log(error)
        })
    }
  }

  getOneImage(image, id) {
    const url = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${id}/${image}`;
    return url; 
  }

  getAdsFromUser = () => {
    const { ads: {data} } = this.state;
    if (typeof data !== 'undefined' && data.length > 0) {
      return data.map((ad, i) => {
        return (
          <AdBox 
            key={i}
            ad={ad}
          />
        )
      })
    }
    else{
      return <p className="not-info">No tiene anuncios activos</p>
    }
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
    if (typeof reviews !== 'undefined' && reviews.length > 0){
      return reviews.map((review, i) => {
        return <ReviewUser key={i} title={review.title} content={review.content} rating={review.rating} />
        })
    } else { 
      return <p className="not-info">No tiene reviews</p>
    }
  }


    render() {
    const { name, level, url, points, missingpoints, tokens, showReviews, status} = this.state;
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADED:
      return (
        <div>
          <HeaderProfile name={name} level={level} url={url} points={points} missingpoints={missingpoints} tokens={tokens} />
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
            </div>
          }
        </div>
      )
      case STATUS.LOADING:
      return (
        <div>
          <Loading />
        </div>
      )
    }
    }   
  }

export default withAuth(Profile);