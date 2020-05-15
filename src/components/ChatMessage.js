import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import '../assets/css/components/chatMessage.scss';

class ChatMessage extends Component {
  render() {
    const {message, user} = this.props;
    if (!message.date) message.date = new Date(message.createdAt);
    return (
      <div className={'chat-message ' + (message.sender === user._id ? 'mine' : '')}>
        <div className={'content'}>
          {message.content}
          <div className={'time'}>
            {message.date.getUTCHours()}:{message.date.getUTCMinutes()}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(ChatMessage);