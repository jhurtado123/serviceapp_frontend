import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from "../context/AuthContext";
import profileApiClient from "../services/apiManager/profile";
import HeaderProfile  from "../Components/HeaderProfile";
import '../assets/css/components/Profile.scss';

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
  }

  componentDidMount = () => {
    this.loadProfile()
    this.getLevel()
  }

  loadProfile = () => {
    profileApiClient
      .getProfile()
      .then(({ data } ) => {
        this.setState({
          _id: data._id,
          name: data.name,
          username: data.username,
          postalcode: data.postalcode,
          points: data.points,
          tokens: data.tokens,
        })
      })
      .catch((error) => {
        console.log(error);
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
      .catch((error) => console.log(error))

  }

  getMissingPoints  = () => {
    const { points, totalpoints } = this.state;
    let result = totalpoints - points;
    this.setState({
      missingpoints: result,
    })
    
  }

  handleServices = () => {
    const { _id } = this.state;
    console.log(_id)
  }
  
  handleReviews = () => {
    const { _id } = this.state;
    console.log(_id)
  }

    render() {
    const { name, level, points, missingpoints, tokens} = this.state;
    return(
      <div>
        <HeaderProfile name={name} level={level} points={points} missingpoints={missingpoints} tokens={tokens} />
        <button className="ButtonUser" onClick={this.handleServices}>Services</button>
        <button className="ButtonUser" onClick={this.handleReviews}>Reviews</button>
      </div>
    )
  }
}

export default withAuth(Profile);