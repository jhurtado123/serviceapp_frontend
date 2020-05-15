import React, {Component} from 'react';
import ChatHeader from "../../components/ChatHeader";
import REDIRECT from "../../errorRedirects";
import chatApiClient from "../../services/apiManager/chat";
import UploadImageIcon from '../../assets/images/icons/chat-upload-image.png';
import SendMessageIcon from '../../assets/images/icons/send-message.png';
import '../../assets/css/views/chat/chat.scss';
import ProfileImage from "../../components/ProfileImage";
import {Link} from 'react-router-dom';
import ChatMessage from "../../components/ChatMessage";
import {withAuth} from "../../context/AuthContext";
import io from 'socket.io-client';

let socket = io.connect(`${process.env.REACT_APP_BACKEND_URI}`);
class Chat extends Component {

  state = {
    chat: undefined,
    messages: [],
    writedMessage: '',
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value,
    })
  };

  handleSendMessage = () => {
    const {writedMessage} = this.state;
    if (!writedMessage) return;
    const {user} = this.props;
    const date = new Date();
    const message = {sender: user._id ,type: 'text', content: writedMessage, date: new Date(date.setHours(date.getHours() + 2))};
   this.addMessage(message);
    this.emitMessage(message);
  };

  addMessage = (message) => {
    const {messages} = this.state;
    this.setState({
      writedMessage: '',
      messages: [...messages, message],
    });
  };

  emitMessage({sender, type, content}) {
    const date = new Date();
    socket.emit('chat:message', {
      content,
      sender,
      chatId: this.state.chat._id,
      type,
      date: date.setHours(date.getHours() + 2),
    });
  }

  printMessages = () => {
    const {messages} = this.state;
    return messages.map((message,index) => <ChatMessage key={index} message={message}/>);
  };

  async componentDidMount() {
    const {history, match: {params}} = this.props;
    if (!params.id) history.push(REDIRECT[404]);

    try {
      const {data: {chat}} = await chatApiClient.getChat(params.id);
      this.joinSocketRoom(chat._id);
      this.setSocketEvents();
      this.setState({
        chat,
      });
      const {data: {messages}} = await chatApiClient.getChatMessages(params.id);
      this.setState({
        messages,
      });
    } catch (e) {
      history.push(REDIRECT[404]);
    }
  }

  joinSocketRoom(id) {
    socket.emit('room:join', id);
  }
  setSocketEvents = () => {
    socket.on('chat:message', (data) => {
      data.date = new Date();
      this.addMessage(data);
    });
  };

  componentWillUnmount() {
    const {chat} = this.state;
    if (chat)
       socket.emit('room:leave', chat._id);
  }

  render() {
    const {messages, chat, writedMessage} = this.state;
    return (
      <div className={'chat-view'}>
        <ChatHeader chat={chat}/>
        <div className={'box-messages container'}>
          {chat ?
            <React.Fragment>
              {!messages.length ?
                <div className={'no-messages-box'}>
                  <Link to={`/profile/${chat.seller.username}`}>
                    <ProfileImage user={chat.seller}/>
                  </Link>
                  <p>Tu conversación con <span>{chat.seller.name}</span> aún no ha comenzado.
                    Escríbele para llegar a un acuerdo sobre el servicio.</p>
                </div> :
                this.printMessages()}
            </React.Fragment>
            :
            <div>Loading</div>}
        </div>
        <div className={'box-send-message container'}>
          <img src={UploadImageIcon} alt="Upload image" className={'upload-image'}/>
          <input type={'text'} value={writedMessage} onChange={this.handleChange} name={'writedMessage'}/>
          <img src={SendMessageIcon} alt="Send message" onClick={this.handleSendMessage}/>
        </div>
      </div>
    );
  }
}

export default withAuth(Chat);