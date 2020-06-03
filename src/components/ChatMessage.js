import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import '../assets/css/components/chatMessage.scss';
import {Link} from "react-router-dom";

class ChatMessage extends Component {

  printMessage(message) {
    const {user, resolveNegotiation, price, seller, buyer, resolveNewDeal} = this.props;
    const otherUser = user._id === seller._id ? buyer : seller;
    // eslint-disable-next-line default-case
    switch (message.type) {
      case 'text':
        return message.data.content;
      case 'image':
        return  <img className={'image-message'} src={message.data.content} alt=""/>;
      case 'renegotiation':
        if (message.sender === user._id) {
          return <div className={'info-message'}>Has solicitado un cambio de precio a {message.data.content} serkens. A la espera de que {otherUser.name} lo acepte...</div>
        }
        return <div className={'renegotiation-message'}>
          <p>{otherUser.name} ha solicitado un cambio de precio a {message.data.content} serkens</p>
          {user._id === buyer._id && user.wallet.tokens < message.data.content ? <p className={'error-message'}>No tienes serkens suficientes</p> : ''}
          <div className={'actions'}>
            {!(user._id === buyer._id && user.wallet.tokens < message.data.content) && <div className={'accept'} onClick={() => resolveNegotiation(true, message.data.content)}>Aceptar</div>}
            <div className={'cancel'} onClick={() => resolveNegotiation(false, message.data.content)}>Declinar</div>
          </div>
        </div>;
      case 'renegotiation-resolve':
        if (message.data.status) {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has aceptado la oferta de {message.data.content} serkens.</div>
          } else {
            return <div className={'info-message'}>{otherUser.name} ha aceptado la oferta de {message.data.content} serkens.</div>
          }
        } else {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has rechazado la oferta de {message.data.content} serkens.</div>
          } else {
            return <div className={'info-message'}>{otherUser.name} ha rechazado la oferta de {message.data.content} serkens.</div>
          }
        }
      case 'new-deal':
        if (message.sender === user._id) {
          return <div className={'info-message'}>Has solicitado una cita para {this.getYYYMMDDHHMMDate(message.data.content)} . A la espera de que {otherUser.name} la acepte...</div>
        }
        return <div className={'new-deal-message'}>
          <p>{otherUser.name} ha propuesto acordar una cita para el {this.getYYYMMDDHHMMDate(message.data.content)}</p>
          {user._id === buyer._id && user.wallet.tokens < price ? <p className={'error-message'}>No tienes serkens suficientes</p> : ''}
          <div className={'actions'}>
            {!(user._id === buyer._id && user.wallet.tokens < price) && <div className={'accept'} onClick={() => resolveNewDeal(true, message.data.content)}>Aceptar</div>}
            <div className={'cancel'} onClick={() => resolveNewDeal(false, message.data.content)}>Declinar</div>
          </div>
        </div>;

      case 'deal-resolve':
        if (message.data.status) {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has aceptado el acuerdo para el día {this.getYYYMMDDHHMMDate(message.data.content)}. Puedes ver la información del acuerdo en <Link to={'/appointments'}>Mis citas</Link></div>
          } else {
            return <div className={'info-message'}>{otherUser.name} ha aceptado el acuerdo para el día {this.getYYYMMDDHHMMDate(message.data.content)}. Puedes ver la información del acuerdo en <Link to={'/appointments'}>Mis citas</Link></div>
          }
        } else {
          if (message.sender === user._id) {
            return <div className={'info-message'}>Has rechazado el acuerdo para el día {this.getYYYMMDDHHMMDate(message.data.content)}.</div>
          } else {
            return <div className={'info-message'}>{otherUser.name} ha rechazado el acuerdo para el día {this.getYYYMMDDHHMMDate(message.data.content)}.</div>
          }
        }
    }
  };

  getYYYMMDDHHMMDate(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${
      date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      (date.getHours()).toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}`
  }

  render() {
    const {message, user} = this.props;
    if (!message.date) message.date = new Date(message.createdAt);
    return (
      <div className={'chat-message ' + (message.sender === user._id ? 'mine' : '')}>
        <div className={'content'}>
          {this.printMessage(message)}
          <div className={'time'}>
            {message.date.getUTCHours()}:{message.date.getUTCMinutes() < 10 ? `0${message.date.getUTCMinutes()}` : message.date.getUTCMinutes()}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(ChatMessage);