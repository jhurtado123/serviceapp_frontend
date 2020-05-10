import React, {Component} from 'react';
import '../assets/css/components/smallAd.scss';
import ProfileImage from "./ProfileImage";
import Token from '../assets/images/icons/coin.png';
import {Link, withRouter} from "react-router-dom";
import AdImagePreview from "./AdImagePreview";

class SmallAd extends Component {
  render() {
    const {ad} = this.props;
    return (
      <Link to={`/ad/${ad._id}`} className={'small-ad'}>
        <AdImagePreview ad={ad} small={true}/>
        <div className={'ad-data'}>
          <h2>{ad.name}</h2>
          <div className={'more-data'}>
            <ProfileImage user={ad.owner} small={true} />
            <div className={'ad-price'}>{ad.price} <img src={Token}/></div>
          </div>
        </div>
      </Link>
    );
  }
}

export default withRouter(SmallAd);