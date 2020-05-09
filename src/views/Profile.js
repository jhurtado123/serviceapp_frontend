import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from "../context/AuthContext";
import profileApiClient from "../services/apiManager/profile";
import HeaderProfile  from "../Components/HeaderProfile";

class Profile extends Component {
  state = {
    name: "",
    username: "",
    postalcode: "",
    tokens: 0,
    level: 0,
  }

  componentDidMount = () => {
    this.loadProfile()
  }

  loadProfile = () => {
    profileApiClient
      .getProfile()
      .then(({ data } ) => {
        this.setState({
          name: data.name,
          username: data.username,
          postalcode: data.postalcode
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  render() {
    const { name, level, tokens} = this.state;
    return(
      <div>
        <HeaderProfile name={name} level={level} tokens={tokens} />
      </div>
    )
  }
}

export default withAuth(Profile);