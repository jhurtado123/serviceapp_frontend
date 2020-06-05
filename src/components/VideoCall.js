import React, {Component} from 'react';
import '../assets/css/components/videoCall.scss';
import HangUpIcon from '../assets/images/icons/hangUp.png';
import CameraOn from '../assets/images/icons/video-camera.png';
import CameraOff from '../assets/images/icons/video-camera-off.png';
import AudioOn from '../assets/images/icons/speaker.png';
import AudioOff from '../assets/images/icons/speaker-off.png';
import VideoUnavailable from '../assets/images/icons/video-unavailable.png';
import Peer from "simple-peer";
import LoadingBars from "./LoadingBars";
import Draggable from 'react-draggable';


let peer;

class VideoCall extends Component {

  state = {
    stream: undefined,
    callerSignal: undefined,
    hasTransmissionResponse: false,
    isCameraOn: true,
    isPartnerCameraOn: true,
    isAudioOn: true,
    isLoading: true,
    cameraDevices: [],
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
    const {cameraDevices} = this.state;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    this.getCameraDevices();

    setTimeout(() => {
     this.setStreamFromCameraDevice(cameraDevices[1]);
    }, 500);


    socket.on("call:handUpDestroyPeerEmit", data => {
      if (peer) peer.destroy();
      if (peer) peer = null;
      hangUpCall();
    });

    socket.on("call:toggled-videocam", data => {
      this.setState({
        isPartnerCameraOn: !this.state.isPartnerCameraOn,
      })
    });

    if (isCaller) {
      setTimeout(this.initRTCransmission, 1000);
    } else {
      this.setCallSocketEvents();
    }

  }

  setStreamFromCameraDevice = (cameraDeviceId) => {
    navigator.getUserMedia({video: { deviceId: cameraDeviceId,  width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true}, (stream) => {
      this.setStream(stream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = stream;
      }
    }, (error) => {
      console.log(error);
    });
  };

  getCameraDevices = () => {
    const {cameraDevices} = this.state;
    navigator.mediaDevices.enumerateDevices().then(function(devices) {
      devices.forEach(function(device) {
        if (device.kind === 'videoinput') cameraDevices.push(device);
      });
    });
  };


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
            isLoading: false,
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
      this.setState({
        isLoading: false,
      });
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
    socket.off('call:toggled-videocam');
  };

  toggleVideoCamera = () => {
    const {isCameraOn, stream} = this.state;
    const {socket, chat} = this.props;
    socket.emit('call:toggle-videocam', {chatId: chat._id});
    stream.getVideoTracks()[0].enabled = !isCameraOn;
    this.setState({
      isCameraOn: !isCameraOn,
    })
  };

  toggleAudio = () => {
    const {isAudioOn, stream} = this.state;
    stream.getAudioTracks()[0].enabled = !isAudioOn;
    this.setState({
      isAudioOn: !isAudioOn,
    })
  };

  getUserVideo = () => {
    const {stream, isCameraOn} = this.state;
    let userVideo;
    if (stream) {
      userVideo = (
        <video className={isCameraOn ? '' : 'hidden'} playsInline muted ref={this.userVideo} autoPlay/>
      );
    }

    return userVideo;
  };

  getPartnerVideo = () => {
    const {isPartnerCameraOn} = this.state;
    return (<video className={isPartnerCameraOn ? '' : 'hidden'} playsInline ref={this.partnerVideo} autoPlay/>)
  };

  render() {
    const {isCameraOn, isPartnerCameraOn, isAudioOn, isLoading} = this.state;
    return (
      <div className={'videoCall-wrapper'}>
        {isLoading && <LoadingBars/>}
        <div id={'partnerVideo'}>
          {this.getPartnerVideo()}
          <img src={VideoUnavailable} alt={'No video'}
               className={'video-unavailable ' + (isPartnerCameraOn ? 'hidden' : '')}/>
        </div>
        <Draggable>
          <div id={'selfVideo'}>
            {this.getUserVideo()}
            <img src={VideoUnavailable} alt={'No video'}
                 className={'video-unavailable ' + (isCameraOn ? 'hidden' : '')}/>
          </div>
        </Draggable>
        <div className={'actions'}>
          {
            isCameraOn ?
              <img src={CameraOn} onClick={this.toggleVideoCamera} alt={'Toggle camera'}/> :
              <img src={CameraOff} onClick={this.toggleVideoCamera} alt={'Toggle camera'}/>
          }
          {
            isAudioOn ?
              <img src={AudioOn} onClick={this.toggleAudio} alt={'Toggle camera'}/> :
              <img src={AudioOff} onClick={this.toggleAudio} alt={'Toggle camera'}/>
          }
        </div>
        <img className={'handUp-call'} src={HangUpIcon} onClick={this.handleHandUp} alt={'hangUpCall'}/>
      </div>
    );
  }
}

export default VideoCall;