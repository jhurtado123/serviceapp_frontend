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
import RenegotiateModal from "../../components/RenegotiateModal";
import DealModal from "../../components/DealModal";
import LoadingBars from "../../components/LoadingBars";


let socket = io.connect(`${process.env.REACT_APP_BACKEND_URI}`);

class Chat extends Component {

  state = {
    chat: undefined,
    messages: [],
    writedMessage: '',
    imageMessage: undefined,
    encodedImage: '',
    showRenegotiateModal: false,
    showDealModal: false,
    isLoading: true,
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
      data: {
        content: encodedImage ? encodedImage : writedMessage
      },
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

  handleCloseRenegotiateModal = () => {
    this.setState({
      showRenegotiateModal: false,
    });
  };

  handleOpenRenegotiation = () => {
    this.setState({
      showRenegotiateModal: true,
    });
  };

  handleCloseDealModal = () => {
    this.setState({
      showDealModal: false,
    });
  };

  handleOpenDealModal = () => {
    this.setState({
      showDealModal: true,
    });
  };

  handleResolveRenegotiation = (status, newPrice) => {
    const {user} = this.props;
    const {messages, chat} = this.state;
    const date = new Date();
    const message = {
      sender: user._id,
      type: 'renegotiation-resolve',
      data: {
       content: newPrice, status: status
      },
      date: new Date(date.setHours(date.getHours() + 2))
    };

    this.setState({
      messages: [...messages.filter(message => message.type !== 'renegotiation'), message],
    });

    socket.emit('chat:message', {
      data: {
        content: newPrice,
        status
      },
      sender: message.sender,
      chatId: this.state.chat._id,
      type: message.type,
      date: date,
    });

    if (status) {
      chat.price = newPrice;
    }

  };

  handleResolveNewDeal = (status, date) => {
    const {user} = this.props;
    const {messages, chat} = this.state;
    const currentDate = new Date();
    const message = {
      sender: user._id,
      type: 'deal-resolve',
      data: {
        content: date, status: status
      },
      date: new Date(currentDate.setHours(currentDate.getHours() + 2))
    };
    this.setState({
      messages: [...messages.filter(message => message.type !== 'new-deal'), message],
    });
    socket.emit('chat:message', {
      data: {
        content: date, status: status,
      },
      sender: message.sender,
      chatId: this.state.chat._id,
      type: message.type,
      date: currentDate,
    });

  };

  handleNewPriceNegotiation = (newPrice) => {
    const {chat, messages} = this.state;
    this.setState({
      showRenegotiateModal: false,
    });
    if (chat.price !== newPrice) {
      const message = this.getNegotiateMessage(newPrice);
      this.setState({
        messages: [...messages, message],
      }, () => {
        this.messagesBoxRef.current.scrollTo(0, 999999999);
      });
      const date = new Date();
      socket.emit('chat:message', {
        data: {
          content: newPrice
        },
        sender: message.sender,
        chatId: this.state.chat._id,
        type: message.type,
        date: date.setHours(date.getHours() + 2),
      });
    }
  };

  handleNewDeal = (date) => {
    this.handleCloseDealModal();
    const {chat, messages} = this.state;
    const message = this.getNewDealMessage(date);
    this.setState({
      messages: [...messages, message],
    }, () => {
      this.messagesBoxRef.current.scrollTo(0, 999999999);
    });
    const currentDate = new Date();
    socket.emit('chat:message', {
      data: {
        content: date
      },
      sender: message.sender,
      chatId: this.state.chat._id,
      type: message.type,
      date: currentDate.setHours(currentDate.getHours() + 2),
    });
  };

  getNewDealMessage = (date) => {
    const {user} = this.props;
    const currentDate = new Date();
    return {
      sender: user._id,
      type: 'new-deal',
      data: {
        content: date
      },
      date: new Date(currentDate.setHours(currentDate.getHours() + 2))
    };
  };

  getNegotiateMessage = (newPrice) => {
    const {user} = this.props;
    const date = new Date();
    return {
      sender: user._id,
      type: 'renegotiation',
      data: {
        content: newPrice
      },
      date: new Date(date.setHours(date.getHours() + 2))
    };
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

  emitMessage({sender, type, data: {content}}) {
    const date = new Date();
    socket.emit('chat:message', {
      data: {
        content: content
      },
      sender,
      chatId: this.state.chat._id,
      type,
      date: date.setHours(date.getHours() + 2),
    });
  }

  printMessages = () => {
    const {messages, chat} = this.state;
    return messages.map((message, index) => <ChatMessage key={index} price={chat.price} message={message} seller={chat.seller} buyer={chat.buyer} resolveNegotiation={this.handleResolveRenegotiation} resolveNewDeal={this.handleResolveNewDeal}/>);
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
        isLoading:false,
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
      const newDate = new Date(data.date);
      data.date = newDate;
      this.addMessage(data);
      if (data.type === 'renegotiation-resolve') {
        if (data.data.status) this.setChatPrice(data.data.content);
        this.removeNegotiationMessages();
      }
      if (data.type === 'deal-resolve') {
        if (data.data.status) this.deleteTokensFromBuyerUser();
        this.removeNewDealMessages();
      }
    });
  };

  deleteTokensFromBuyerUser = () => {
    const {chat: {price, buyer}} = this.state;
    const {user} = this.props;
    if (user._id === buyer._id)  {
      user.wallet.tokens -= price;
    }
  };

  removeNegotiationMessages = () => {
    this.setState({
      messages: [...this.state.messages.filter(message => message.type !== 'renegotiation')]
    })
  };
  removeNewDealMessages = () => {
    this.setState({
      messages: [...this.state.messages.filter(message => message.type !== 'new-deal')]
    })
  };

  setChatPrice = (newPrice) => {
    const {chat} = this.state;
    chat.price = newPrice;
    this.setState({
      chat,
    })
  };

  existAnyNegotioation = () => {
    const {messages} = this.state;
    let response = false;
    messages.forEach(message => {
      if (message.type === 'renegotiation') {
        response = true;
      }
    });
    return response;
  };
  existDealPending = () => {
    const {messages} = this.state;
    let response = false;
    messages.forEach(message => {
      if (message.type === 'new-deal') {
        response = true;
      }
    });
    return response;
  };

  componentWillUnmount() {
    const {chat} = this.state;
    if (chat)
      socket.emit('room:leave', chat._id);
  }

  render() {
    const {messages, chat, writedMessage, encodedImage, showRenegotiateModal, showDealModal, isLoading} = this.state;
    const {user} = this.props;
    return (
      <div className={'chat-view'}>
        <ChatHeader chat={chat} openRenegotiaton={this.handleOpenRenegotiation} openDealModal={this.handleOpenDealModal}/>
        <div className={'box-messages container'} ref={this.messagesBoxRef}>
          {isLoading ? <LoadingBars/> :
            chat ?
            <React.Fragment>
              {!messages.length ?
                <div className={'no-messages-box'}>
                  <Link to={`/profile/${chat.seller._id === user._id ? chat.buyer.username : chat.seller.username}`}>
                    <ProfileImage user={chat.seller._id === user._id ? chat.buyer : chat.seller}/>
                  </Link>
                  <p>Tu conversación
                    con <span>{chat.seller._id === user._id ? chat.buyer.name : chat.seller.name}</span> aún no ha
                    comenzado.
                    Escríbele para llegar a un acuerdo sobre el servicio.</p>
                </div> :
                this.printMessages()}
              <RenegotiateModal isThereAnyNegotiation={this.existAnyNegotioation()} isThereAnyDealPending={this.existDealPending()} newNegotiation={this.handleNewPriceNegotiation} show={showRenegotiateModal}
                                value={chat.price} availableTokens={user.wallet.tokens}
                                handleClose={this.handleCloseRenegotiateModal} seller={chat.seller}/>
              <DealModal show={showDealModal} price={chat.price} isThereAnyDealPending={this.existDealPending()}
                                value={chat.price} availableTokens={user.wallet.tokens}
                                handleClose={this.handleCloseDealModal} newDeal={this.handleNewDeal} buyerHasNoTokens={user._id === chat.buyer._id && user.wallet.tokens < chat.price}/>
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