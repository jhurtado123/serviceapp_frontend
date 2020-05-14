import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import '../assets/css/components/chatMessage.scss';

class ChatMessage extends Component {
  render() {
    const {message, user} = this.props;
    console.log(message);
    return (
      <div className={'chat-message ' + (message.sender === user._id ? 'mine' : '')}>
        <div className={'content'}>
          {message.content}
          <div className={'time'}>
            {message.date.getUTCHours()+2}:{message.date.getUTCMinutes()}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(ChatMessage);