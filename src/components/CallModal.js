import React, {Component} from 'react';
import Modal from "./Modal";
import '../assets/css/components/renegotiateModal.scss';


class CallModal extends Component {


  printData() {
    const {isCalling, handleClose, isReceivingCall, otherUser, acceptCall} = this.props;
    if (isCalling) {
      return <React.Fragment>
        <p className={'info-message'}>Llamando...</p>
        <div className={'buttons'}>
          <div className={'close'} onClick={handleClose}>Cancelar</div>
        </div>
      </React.Fragment>
    }

    if (isReceivingCall) {
      return <React.Fragment>
        <p className={'info-message'}>{otherUser.name} quiere hacer una videollamada contigo.</p>
        <div className={'buttons'}>
          <div className={'close'} onClick={handleClose}>Declinar</div>
          <div className={'accept'} onClick={acceptCall}>Aceptar</div>
        </div>
      </React.Fragment>
    }
  }

  render() {
    const {show, handleClose} = this.props;
    return (
      <Modal title={'Videollamada'} show={show} handleClose={handleClose}>
        {this.printData()}
      </Modal>
    );
  }
}

export default CallModal;