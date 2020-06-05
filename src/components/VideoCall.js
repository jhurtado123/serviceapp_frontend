import React, {Component} from 'react';
import '../assets/css/components/videoCall.scss';
import HangUpIcon from '../assets/images/icons/hangUp.png';
import Peer from "simple-peer";

let peer;
class VideoCall extends Component {

  state = {
    stream: undefined,
    callerSignal: undefined,
    hasTransmissionResponse: false,
  };

  setStream = (stream) => {
    this.setState({
      stream
    })
  };

  userVideo = React.createRef();
  partnerVideo = React.createRef();


  componentDidMount() {
    const {isCaller, socket, hangUpCall} = this.props;
    navigator.getUserMedia({video: true, audio: true}, (stream) => {
      this.setStream(stream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = stream;
      }
    }, (error) => {
      console.log(error);
    });

    socket.on("call:handUpDestroyPeerEmit", data => {
      if (peer) peer.destroy();
      if (peer) peer = null;
      hangUpCall();
    });
    if (isCaller) {
      setTimeout(this.initRTCransmission, 1000);
    } else {
      this.setCallSocketEvents();
    }

  }

  setCallSocketEvents = () => {
    const {socket} = this.props;

    socket.on('call:handShakeRequest', (data) => {
      const {hasTransmissionResponse} = this.state;

      if (hasTransmissionResponse) return false;
      this.setState({
        callerSignal: data.signalData,
      }, () => {
        setTimeout(() => {
          this.responseRTCTransmission();
          this.setState({
            hasTransmissionResponse: true,
          });
        }, 1);
      })
    });
  };

  responseRTCTransmission = () => {
    const {socket, chat} = this.props;
    const {callerSignal, stream} = this.state;

    peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("call:handShakeAccept", {signal: data, chatId: chat._id});
    });

    peer.on("stream", stream => {
      this.partnerVideo.current.srcObject = stream;
    });

    peer.on('error', (err) => {
      this.handleHandUp();
    });

    peer.on('close', () => {
    });

    peer.signal(callerSignal);
  };

  initRTCransmission = () => {
    const {stream} = this.state;
    const {socket, chat} = this.props;
    if (peer) peer.destroy();

    peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
          },
        ]
      },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("call:handShake", {chatId: chat._id, signalData: data});
    });
    peer.on("stream", stream => {
      if (this.partnerVideo.current) {
        this.partnerVideo.current.srcObject = stream;
      }
    });

    peer.on('error', (err) => {
      console.log('Peer error', err);
      this.handleHandUp();
    });

    peer.on('close', () => {
      console.log('closed');
    });

    socket.on("call:handShakeRequestAccepted", data => {
      peer.signal(data.signal);
    });

  };

  handleHandUp = () => {
    const {hangUpCall, socket, chat} = this.props;
    socket.emit('call:handUpDestroyPeer', {chatId: chat._id,});
    if (peer) peer.destroy();
    hangUpCall();
  };

  componentWillUnmount = () => {
    const {socket, chat} = this.props;
    const {stream} = this.state;
    stream.getTracks().forEach(track => track.stop());
    socket.emit('call:handUpDestroyPeer', {chatId: chat._id,});
    this.removeSocketEvents();
    this.setState({
      hasTransmissionResponse: false,
    });
    if (peer) peer.destroy(1);
  };

  removeSocketEvents = () => {
    const {socket} = this.props;
    socket.off('call:handShakeRequest');
    socket.off('call:handUpDestroyPeerEmit');
    socket.off('call:handShakeRequestAccepted');
  };

  getUserVideo = () => {
    const {stream} = this.state;
    let userVideo;

    if (stream) {
      userVideo = (
        <video playsInline muted ref={this.userVideo} autoPlay/>
      );
    }

    return userVideo;
  };

  getPartnerVideo = () => {
    return (<video playsInline ref={this.partnerVideo} autoPlay/>)
  };

  render() {
    return (
      <div className={'videoCall-wrapper'}>
        <div id={'partnerVideo'}>
          {this.getPartnerVideo()}
        </div>
        <div id={'selfVideo'}>
          {this.getUserVideo()}
        </div>
        <img className={'handUp-call'} src={HangUpIcon} onClick={this.handleHandUp} alt={'hangUpCall'}/>
      </div>
    );
  }
}

export default VideoCall;