import React, {Component} from 'react';
import '../assets/css/components/videoCall.scss';
import HangUpIcon from '../assets/images/icons/hangUp.png';
import Peer from "simple-peer";

class VideoCall extends Component {

  state = {
    stream: undefined,
    callerSignal: undefined,
  };

  setStream = (stream) => {
    this.setState({
      stream
    })
  };

  userVideo = React.createRef();
  partnerVideo = React.createRef();


  componentDidMount() {
    const {socket, isCaller} = this.props;
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
      this.setStream(stream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = stream;
      }
    });

    if (isCaller) {
      this.initRTCransmission();
    } else {
      this.setCallSocketEvents();
    }
  }

  setCallSocketEvents = () => {
    const {socket} = this.props;

    socket.on('call:handShakeRequest', (data) => {
      console.log('Received handshake request');
      console.log(data);
      this.setState({
        callerSignal: data.signalData,
      }, () => {
        setTimeout( this.responseRTCTransmission, 1000);

      })

    });

  };

  responseRTCTransmission = () => {
    const {socket, chat} = this.props;
    const {callerSignal, stream} = this.state;

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      console.log('Accept handshake');
      console.log(data);
      socket.emit("call:handShakeAccept", {signal: data, chatId: chat._id});
    });

    peer.on("stream", stream => {
      console.log('--------------------__STREAM------------------');
      this.partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  initRTCransmission = () => {
    const {stream} = this.state;
    const {socket, chat} = this.props;
    console.log('init');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683"
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683"
          }
        ]
      },
      stream: stream,
    });
    peer.on("signal", data => {
      console.log('Signal received, sending handShake');
      console.log(data);
      socket.emit("call:handShake", {chatId: chat._id, signalData: data})
    });
    peer.on("stream", stream => {
      console.log('--------------------__STREAM------------------');
      if (this.partnerVideo.current) {
        this.partnerVideo.current.srcObject = stream;
      }
    });
    socket.on("call:handShakeRequestAccepted", data => {
      console.log('Handshake request accepted');
      console.log(data);
      peer.signal(data.signal);
    })

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
    const {hangUpCall} = this.props;

    return (
      <div className={'videoCall-wrapper'}>
        <div id={'partnerVideo'}>
          {this.getPartnerVideo()}
        </div>
        <div id={'selfVideo'}>
          {this.getUserVideo()}
        </div>
        <img className={'handUp-call'} src={HangUpIcon} onClick={hangUpCall} alt={'hangUpCall'}/>
      </div>
    );
  }
}

export default VideoCall;