import React, {Component} from 'react';
import AdImagePreview from "./AdImagePreview";
import '../assets/css/components/adBox.scss';
import ProfileImage from "./ProfileImage";
import Token from '../assets/images/icons/coin.svg'
import {Link} from 'react-router-dom';

class AdBox extends Component {
  render() {
    const {ad} = this.props;
    return (
      <Link className={'ad-box'} to={`/ad/${ad._id}`}>
        <AdImagePreview ad={ad} />
        <div className={'ad-data'}>
          <h2>{ad.name}</h2>
          <div className={'info'}>
            <ProfileImage user={ad.owner}/>
            <div className={'price'}>
              {ad.price} <img src={Token} alt="token" />
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default AdBox;