import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Edit from '../assets/images/icons/edit.png';
import Trash from '../assets/images/icons/trash.png';
import '../assets/css/components/profileAdBox.scss';


class ProfileAdBox extends Component {
  render() {
    const {name, _id, handleDelete, isRecover, handleRecover} = this.props;
    return (
      <div className={'profile-ad-box'}>
        <div className={'preview-image'}>a</div>
        <div className={'ad-data'}>
          <h2>{name}</h2>
          <div className={'action-buttons ' + (isRecover && ' is-recover')}>
            {!isRecover ?
              <React.Fragment>
                <Link to={`/ad/${_id}/edit`}>
                  <img src={Edit}/><span>Edit</span>
                </Link>
                <div onClick={(e) => {
                  handleDelete(e, _id)
                }}>
                  <img src={Trash}/>
                </div>
              </React.Fragment> :
              <div className={'button-bck-purple recover'} onClick={() => handleRecover(_id)}>Recuperar</div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default ProfileAdBox;