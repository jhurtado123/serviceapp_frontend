import React, {Component} from 'react';
import '../assets/css/components/modal.scss';

class Modal extends Component {
  render() {
    const {show, title, children, handleClose} = this.props;
    return (
      <div>
        <div className={'modal ' + (show ? 'show' : 'hide')}>
          <div className={'modal-header'}>
            {title}
            <div className={'modal-close'} onClick={handleClose}>X</div>
          </div>
          <div className={'modal-body'}>
            {children}
          </div>
        </div>
        <div className={'backdrop'} />
      </div>
    );
  }
}

export default Modal;