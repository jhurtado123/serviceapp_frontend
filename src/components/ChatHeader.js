import React, {Component} from 'react';
import backIcon from '../assets/images/icons/back-white.png';
import {withRouter} from 'react-router-dom';
import Token from '../assets/images/icons/coin.svg';
import '../assets/css/components/chatHeader.scss';
import {Link} from 'react-router-dom';
import RenegotiateIcon from '../assets/images/icons/renegotiate.png';
import VideoCallIcon from '../assets/images/icons/phone-green.png';
import CloseDealIcon from '../assets/images/icons/close-deal.png';



class ChatHeader extends Component {
  render() {
    const {history, chat, openRenegotiaton, openDealModal, videoCall} = this.props;
    return (
      <div className={'chat-header container'}>
        <img src={backIcon} className={'back'} alt="" onClick={history.goBack}/>
        {chat ?
          <React.Fragment>
            <div className={'ad-info'}>
              <Link to={`/ad/${chat.ad._id}`}>{chat.ad.name}</Link>
              <p>{chat.price} <img src={Token} alt="serken" /></p>
            </div>
            <div className={'chat-actions'}>
              <div className={'action videoCall'} onClick={videoCall}>
                <img src={VideoCallIcon} alt="renegotiate"/>
              </div>
              <div className={'action negotiate'} onClick={openRenegotiaton}>
                <img src={RenegotiateIcon} alt="renegotiate"/>
              </div>
              <div className={'action close-deal'} onClick={openDealModal}>
                <img src={CloseDealIcon} alt="deal"/>
              </div>
            </div>
          </React.Fragment> :
          <div className={'loading'} />
        }
      </div>
    );
  }
}

export default withRouter(ChatHeader);