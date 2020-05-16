import React, {Component} from 'react';
import {withAuth} from "../context/AuthContext";
import ProfileImage from "./ProfileImage";
import {Link} from 'react-router-dom';
import '../assets/css/components/chatBox.scss';

class ChatBox extends Component {
  render() {
    const {chatWrap: {chat, unReadMessages}, user} = this.props;
    const otherUser = chat.seller === user ? chat.buyer : chat.seller;
    return (
      <Link className={'chat-box'} to={`/chats/${chat._id}`}>
        <ProfileImage user={otherUser}/>
        <div className={'data'}>
          <h2>{chat.ad.name}</h2>
          <p>Chat con <span>{otherUser.name}</span></p>
        </div>
        <div className={'unRead-messages ' + ( unReadMessages ? 'hasUnread' : '')}>
          {unReadMessages}
        </div>
      </Link>
    );
  }
}

export default withAuth(ChatBox);