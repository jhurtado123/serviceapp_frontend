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
import CloseGoldIcon from '../../assets/images/icons/close-gold.png';

let socket = io.connect(`${process.env.REACT_APP_BACKEND_URI}`);

class Chat extends Component {

  state = {
    chat: undefined,
    messages: [],
    writedMessage: '',
    imageMessage: undefined,
    encodedImage: '',
  };

  fileRef = React.createRef();
  messagesBoxRef = React.createRef();

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  handleSendMessage = () => {
    const {writedMessage, encodedImage} = this.state;
    if (!writedMessage && !encodedImage) return;

    const message = this.getMessage();
    this.addMessage(message);
    this.emitMessage(message);
  };

  getMessage() {
    const {writedMessage, encodedImage} = this.state;
    const {user} = this.props;
    const date = new Date();

    return {
      sender: user._id,
      type: encodedImage ? 'image' : 'text',
      content: encodedImage ? encodedImage : writedMessage,
      date: new Date(date.setHours(date.getHours() + 2))
    };
  }

  handleImageUpload = () => {
    this.fileRef.current.click();
  };

  handleImageChange = (e) => {
    this.setState({
      [e.target.name]: e.target.files[0],
    });
    this.setEncodedImage(e.target.files[0]);
  };

  handleRemoveImage = () => {
    this.setState({
      imageMessage: undefined,
      encodedImage: '',
    });
  };

  setEncodedImage = (file) => {
    var fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => {
      this.setState({
        encodedImage: fileLoadedEvent.target.result
      })
    };
    fileReader.readAsDataURL(file);
  };

  addMessage = (message) => {
    const {messages} = this.state;
    this.setState({
      writedMessage: '',
      messages: [...messages, message],
      imageMessage: undefined,
      encodedImage: '',
    }, () => {
      this.messagesBoxRef.current.scrollTo(0, 999999999);
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
    return messages.map((message, index) => <ChatMessage key={index} message={message}/>);
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
      }, () => {
        this.messagesBoxRef.current.scrollTo(0, 999999999);
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
    const {messages, chat, writedMessage, encodedImage} = this.state;
    const {user} = this.props;
    return (
      <div className={'chat-view'}>
        <ChatHeader chat={chat}/>
        <div className={'box-messages container'} ref={this.messagesBoxRef}>
          {chat ?
            <React.Fragment>
              {!messages.length ?
                <div className={'no-messages-box'}>
                  <Link to={`/profile/${chat.seller._id === user._id ? chat.buyer.username : chat.seller.username}`}>
                    <ProfileImage user={chat.seller._id === user._id ? chat.buyer : chat.seller}/>
                  </Link>
                  <p>Tu conversación con <span>{chat.seller._id === user._id ? chat.buyer.name : chat.seller.name}</span> aún no ha comenzado.
                    Escríbele para llegar a un acuerdo sobre el servicio.</p>
                </div> :
                this.printMessages()}
            </React.Fragment>
            :
            <div>Loading</div>}
        </div>
        <div className={'box-send-message container ' + (encodedImage ? 'content-image' : '')}>
          <img src={UploadImageIcon} alt="Upload image" className={'upload-image'} onClick={this.handleImageUpload}/>
          <input hidden accept={'image/*'} type="file" name={'imageMessage'} ref={this.fileRef}
                 onChange={this.handleImageChange}/>
          {encodedImage ?
            <div className={'imageToSend'}>
              <div className={'remove'} onClick={this.handleRemoveImage}>
                <img src={CloseGoldIcon} alt=""/>
              </div>
              <img src={encodedImage}/>
            </div>
            :
            <input type={'text'} value={writedMessage} onChange={this.handleChange} name={'writedMessage'}/>
          }
          <img src={SendMessageIcon} alt="Send message" onClick={this.handleSendMessage}/>
        </div>
      </div>
    );
  }
}

export default withAuth(Chat);