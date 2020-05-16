import React, {Component} from 'react';
import Token from "../assets/images/icons/coin.png";
import Modal from "./Modal";
import '../assets/css/components/renegotiateModal.scss';


class RenegotiateModal extends Component {

  state = {
    price: this.props.value,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  render() {
    const {show, availableTokens, handleClose, newNegotiation, isThereAnyNegotiation} = this.props;
    const {price} = this.state;
    return (
      <Modal title={'Renegociar precio'} show={show} handleClose={handleClose}>
        {isThereAnyNegotiation ?
          <div>Ya hay una negociación en curso. Hasta que no se resuelva no se puede volver a negociar el precio final.</div>
          :
          <React.Fragment>
            <div className={'your-tokens'}>
              Tokens disponibles: <span>{availableTokens} <img src={Token} alt=""/></span>
            </div>
            <div className={'price-range'}>
              <div className={'current-value'}>
                {price} <img src={Token} alt=""/>
              </div>
              <input type="range" name={'price'} min={1} max={availableTokens} value={price}
                     onChange={this.handleChange}/>
            </div>
            <div className={'buttons'}>
              <div className={'close'} onClick={handleClose}>Cancelar</div>
              <div className={'button-bck-purple'} onClick={() => newNegotiation(price)}>Proponer</div>
            </div>
          </React.Fragment>
        }
      </Modal>
    );
  }
}

export default RenegotiateModal;