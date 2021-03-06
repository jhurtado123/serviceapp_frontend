import React, {Component} from 'react';
import '../assets/css/components/videoCall.scss';
import HangUpIcon from '../assets/images/icons/hangUp.png';
import CameraOn from '../assets/images/icons/video-camera.png';
import CameraOff from '../assets/images/icons/video-camera-off.png';
import AudioOn from '../assets/images/icons/speaker.png';
import AudioOff from '../assets/images/icons/speaker-off.png';
import SwitchCamera from '../assets/images/icons/switch-camera.png';
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
    activeCameraIndex: 0,
    lastStream: undefined,
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
      if (cameraDevices.length) {
        this.setStreamFromCameraDevice(cameraDevices[0].deviceId);
      } else {
        this.toggleVideoCamera();
        this.setStreamOnlyFromMicro();
      }
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

  switchCamera = () => {
    const {cameraDevices, activeCameraIndex} = this.state;
    let newIndex = activeCameraIndex === 0 ? 1 : 0;
    this.setState({
      activeCameraIndex: newIndex,
    });
    this.setStreamFromCameraDevice(cameraDevices[newIndex].deviceId);
  };

  setStreamFromCameraDevice = (cameraDeviceId) => {
    const {stream, lastStream} = this.state;

    navigator.getUserMedia({video: {deviceId: cameraDeviceId, width: 300, height: 100}, audio: true}, (newStream) => {
      if (peer && stream) {
        newStream.getTracks().forEach(track => {
          if (track.kind === 'video') {
            stream.getTracks().forEach(lastStreamTrack => {
              if (track.kind === 'video') {
                try {
                  peer.replaceTrack(lastStreamTrack, track, stream);
                } catch (e) {}
                if (lastStream) {
                  try {
                    peer.replaceTrack(lastStreamTrack, track, lastStream);
                  } catch (e) {}
                }
              }
            });
          }
        });
      }
      if (stream && !lastStream) {
        this.setState({
          lastStream: stream,
        })
      }
      this.setStream(newStream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = newStream;
      }
    }, (error) => {
      console.log('err', error);
    });
  };

  setStreamOnlyFromMicro = () => {
    const {stream} = this.state;

    navigator.getUserMedia({audio: true}, (newStream) => {

      this.setStream(newStream);
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = newStream;
      }
    }, (error) => {
      console.log('err', error);
    });
  };

  getCameraDevices = () => {
    const {cameraDevices} = this.state;
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.forEach(function (device) {
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
            urls: "stun:eu-turn3.xirsys.com",
          },
          {
            username: "mCUg_vLCEZnFETmpcyvcxb1gpXHc1KhZO9b_8DnvZJh1jHrQOUi1p1jA9pW2B5sNAAAAAF7agmxqaHVydGFkbzEyMw==",
            credential: "f9dab90e-a752-11ea-a15a-0242ac140004",
            urls: "turn:eu-turn3.xirsys.com:80?transport=udp",
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
      this.handleHandUp();
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
    if (stream) stream.getTracks().forEach(track => track.stop());
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
    if (stream) stream.getVideoTracks()[0].enabled = !isCameraOn;
    this.setState({
      isCameraOn: !isCameraOn,
    })
  };

  toggleAudio = () => {
    const {isAudioOn, stream, cameraDevices} = this.state;
    if (stream && cameraDevices) {
      stream.getAudioTracks()[0].enabled = !isAudioOn;
      this.setState({
        isAudioOn: !isAudioOn,
      })
    }
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
    const {isCameraOn, isPartnerCameraOn, isAudioOn, isLoading, cameraDevices} = this.state;
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
          {
            cameraDevices.length > 1 && <img src={SwitchCamera} onClick={this.switchCamera} alt={'Switch camera'}/>
          }
        </div>
        <img className={'handUp-call'} src={HangUpIcon} onClick={this.handleHandUp} alt={'hangUpCall'}/>
      </div>
    );
  }
}

export default VideoCall;