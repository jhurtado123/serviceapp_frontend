import React, { Component } from 'react';
import '../assets/css/components/AdLink.scss';

class AdLink extends Component {
  render(){
    const { name, price, url} = this.props;
    console.log('img', url)
    return(
      <div className="AdLink">
        <div className="AdLinkImg">
          <img src={url} alt={name} />
        </div>
        <div className="AdLinkInfo">
          <p className="AdLinkTitle">{name}</p>
          <div>
            <img src={require('../assets/images/icons/stars.png')} alt="stars" />
          </div>
          <div className="AdLinkPriceContainer">
            <span className="AdLinkPrice">desde {price}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default AdLink;