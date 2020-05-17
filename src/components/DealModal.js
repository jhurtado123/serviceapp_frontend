import React, {Component} from 'react';
import Modal from "./Modal";
import '../assets/css/components/dealModal.scss';
import DateTimePicker from "react-datetime-picker";


class DealModal extends Component {

  state = {
    date: new Date(),
  };

  handleChange = (date) => {
    this.setState({
      date,
    })
  };

  render() {
    const {date} = this.state;
    const {show, handleClose, buyerHasNoTokens, newDeal, isThereAnyDealPending} = this.props;
    return (
      <Modal show={show} handleClose={handleClose} title={'Cerrar acuerdo'}>
        {isThereAnyDealPending ?
          <p className={'deal-modal-info'}>Ya hay una solicitud de cita pendiente, antes de poder pedir otra se ha de
            resolver la anterior.</p> :
          <React.Fragment>
            {
              buyerHasNoTokens ?
                <p className={'deal-modal-info'}>No tienes serkens suficientes para cerrar el acuerdo, puedes renegociar
                  el precio o comprar más antes de envíar la solicitud.</p> :
                <React.Fragment>
                  <p className={'deal-modal-info'}>Manda una solicitud para cerrar el acuerdo y marcar un día y una hora
                    al
                    servicio.
                    Una vez el otro usuario acepte podrás ver toda la información al respecto en tu apartado de
                    citas.</p>
                  <DateTimePicker
                    onChange={this.handleChange}
                    value={date}
                    format={'dd-MM-yy H:mm'}
                    minDate={new Date()}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    locale={'es-ES'}
                  />
                </React.Fragment>
            }
            <div className={'buttons'}>
              <div className={'close'} onClick={handleClose}>Cancelar</div>
              {!buyerHasNoTokens && !isThereAnyDealPending &&
              <div className={'button-bck-purple'} onClick={() => newDeal(date)}>Envíar</div>}
            </div>
          </React.Fragment>
        }
      </Modal>
    );
  }
}

export default DealModal;