import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import '../assets/css/components/chatMessage.scss';

class ChatMessage extends Component {

  printMessage(message) {
    const {user, resolveNegotiation} = this.props;
    switch (message.type) {
      case 'text':
        return message.data.content;
        break;
      case 'image':
        return  <img className={'image-message'} src={message.data.content} alt=""/>;
        break;
      case 'renegotiation':
        if (message.sender === user._id) {
          return <div className={'info-message'}>Has solicitado un cambio de precio a {message.data.content} serkens. A la espera de que el otro usuario lo acepte...</div>
        }
        return <div className={'renegotiation-message'}>
          <p>Se ha solicitado un cambio de precio a {message.data.content} serkens</p>
          {user.wallet.tokens < message.data.content ? <p className={'error-message'}>No tienes tokens suficientes</p> : ''}
          <div className={'actions'}>
            {user.wallet.tokens >= message.data.content && <div className={'accept'} onClick={() => resolveNegotiation(true, message.data.content)}>Aceptar</div>}
            <div className={'cancel'} onClick={() => resolveNegotiation(false, message.data.content)}>Declinar</div>
          </div>
        </div>;
        break;
      case 'renegotiation-resolve':
        if (message.data.status) {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has aceptado la oferta de {message.data.content} serkens.</div>
          } else {
            return <div className={'info-message'}>Se ha aceptado la oferta de {message.data.content} serkens.</div>
          }
        } else {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has rechazado la oferta de {message.data.content} serkens.</div>
          } else {
            return <div className={'info-message'}>Se ha rechazado la oferta de {message.data.content} serkens.</div>
          }
        }
        break;
    }
  };

  render() {
    const {message, user} = this.props;
    if (!message.date) message.date = new Date(message.createdAt);
    return (
      <div className={'chat-message ' + (message.sender === user._id ? 'mine' : '')}>
        <div className={'content'}>
          {this.printMessage(message)}
          <div className={'time'}>
            {message.date.getUTCHours()}:{message.date.getUTCMinutes()}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(ChatMessage);