import React, {Component} from 'react';
import '../assets/css/components/videoCall.scss';
import HangUpIcon from '../assets/images/icons/hangUp.png';
import Peer from "simple-peer";

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
    const {socket, isCaller} = this.props;
    navigator.getUserMedia({video: true, audio: true}, (stream) => {
      this.setStream(stream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = stream;
      }
    }, (error) => {
      console.log(error);
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
          })
        }, 1);
      })

    });

  };

  responseRTCTransmission = () => {
    const {socket, chat} = this.props;
    const {callerSignal, stream} = this.state;

    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("call:handShakeAccept", {signal: data, chatId: chat._id});
    });

    peer.on("stream", stream => {
      this.partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  initRTCransmission = () => {
    const {stream} = this.state;
    const {socket, chat} = this.props;
    const peer = new Peer({
      initiator: true,
      trickle: true,
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
      console.log('connected data', data);
      socket.emit("call:handShake", {chatId: chat._id, signalData: data})
    });
    peer.on("stream", stream => {
      if (this.partnerVideo.current) {
        this.partnerVideo.current.srcObject = stream;
      }
    });
    socket.on("call:handShakeRequestAccepted", data => {
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