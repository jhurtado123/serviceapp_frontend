import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Edit from '../assets/images/icons/edit.png';
import Trash from '../assets/images/icons/trash.png';
import '../assets/css/components/profileAdBox.scss';
import AdImagePreview from "./AdImagePreview";


class ProfileAdBox extends Component {
  render() {
    const {ad, handleDelete, isRecover, handleRecover} = this.props;
    return (
      <div className={'profile-ad-box'}>
       <AdImagePreview ad={ad} />
        <div className={'ad-data'}>
          <h2>{ad.name}</h2>
          <div className={'action-buttons ' + (isRecover && ' is-recover')}>
            {!isRecover ?
              <React.Fragment>
                <Link to={`/ad/${ad._id}/edit`}>
                  <img src={Edit}/><span>Edit</span>
                </Link>
                <div onClick={(e) => {
                  handleDelete(e, ad._id)
                }}>
                  <img src={Trash}/>
                </div>
              </React.Fragment> :
              <div className={'button-bck-purple recover'} onClick={() => handleRecover(ad._id)}>Recuperar</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileAdBox;