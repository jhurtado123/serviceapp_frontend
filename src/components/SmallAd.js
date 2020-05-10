import React, {Component} from 'react';
import '../assets/css/components/smallAd.scss';
import ProfileImage from "./ProfileImage";
import Token from '../assets/images/icons/coin.png';
import {Link, withRouter} from "react-router-dom";

class SmallAd extends Component {
  render() {
    const {_id, name, price, owner} = this.props;
    return (
      <Link to={`/ad/${_id}`} className={'small-ad'}>
        <div className={'ad-preview'}></div>
        <div className={'ad-data'}>
          <h2>{name}</h2>
          <div className={'more-data'}>
            <ProfileImage user={owner} small={true} />
            <div className={'ad-price'}>{price} <img src={Token}/></div>
          </div>
        </div>
      </Link>
    );
  }
}

export default withRouter(SmallAd);