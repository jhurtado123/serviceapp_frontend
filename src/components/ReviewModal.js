import React, {Component} from 'react';
import Modal from "./Modal";
import LoadingBars from "./LoadingBars";
import appointmentApiClient from "../services/apiManager/appointment";
import '../assets/css/components/reviewModal.scss';
import {withAuth} from "../context/AuthContext";
import profileApiClient from "../services/apiManager/profile";

class ReviewModal extends Component {

  state = {
    isLoading: true,
    appointment: undefined,
    stars: 3,
    valoration: '',
    showMediationForm: false,
    error: false,
    mediationText: '',
    success: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCheckboxMediation = (e) => {
    this.setState({
      showMediationForm: !this.state.showMediationForm,
    })
  };

  getAppointmentInfo = async (appointmentId) => {
    try {
      const {data: {appointment}} = await appointmentApiClient.getAppointmentDataForReview(appointmentId);
      this.setState({
        appointment: appointment,
        isLoading: false,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        error: true,
        success: false,
        appointment: undefined,
      })
    }
  };

  handleStarsChange = (value) => {
    this.setState({
      stars: value,
    })
  };

  putReview = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      await profileApiClient.putReview(this.state);
      this.setState({
        isLoading: false,
        success: true,
      })

    } catch (e) {
      this.setState({
        isLoading: false,
        error: true,
        appointment: undefined
      })
    }
  };

  printStars = () => {
    const {stars} = this.state;
    const starsHtml = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        starsHtml.push(<div onClick={() => {
          this.handleStarsChange(i)
        }} className={'star checked'}>★</div>)
      } else {
        starsHtml.push(<div onClick={() => {
          this.handleStarsChange(i)
        }} className={'star'}>★</div>);
      }

    }
    return starsHtml;
  };

  resetModal = () => {
    this.setState({
      appointment: undefined,
      error: false,
      isLoading: true,
      success: false,
    })
  };

  render() {
    const {isLoading, appointment, error, showMediationForm, mediationText, valoration, success} = this.state;
    const {show, handleClose, appointmentId, user} = this.props;
    if (!show && (appointment || error)) {
      this.resetModal();
    }
    if (show && !appointment && !error) {
      this.getAppointmentInfo(appointmentId);
    }
    return (
      <Modal show={show} handleClose={handleClose} title={'Valorar'}>
        {isLoading ? <LoadingBars/> :
          <React.Fragment>
            {appointment &&
            (success ?
              <React.Fragment>
                <div className={'review-modal-message'}>Se ha publicado con éxito.</div>
                <div className={'actions close-review-modal'}>
                  <div className={'close'} onClick={handleClose}>Cerrar</div>
                </div>
              </React.Fragment>
              :
              <div className={'review-modal-form'}>
                <p>
                  Valoración para el
                  usuario <b>{appointment.seller._id === user._id ? appointment.buyer.name : appointment.seller.name}</b> por
                  el servicio del anuncio: {appointment.ad.name}
                </p>
                <div className={'stars'}>
                  {this.printStars()}
                </div>
                <div className={'form-group'}>
                  <label>Valoración:</label>
                  <textarea name={'valoration'} onChange={this.handleChange} rows={2} maxLength={100}
                            value={valoration}/>
                </div>
                {
                  user._id === appointment.buyer._id &&
                  <React.Fragment>
                    <div className={'form-group checkbox'}>
                      <input onChange={this.handleCheckboxMediation} id={'showMediationForm'}
                             type={'checkbox'} checked={showMediationForm} value={showMediationForm}
                             name={'showMediationForm'}/>
                      <label htmlFor={'showMediationForm'} className={'checkbox-pretty'}/>
                      <label htmlFor={'showMediationForm'}>Solicitar una mediación</label>
                    </div>

                    <div className={'mediation-box  ' + (showMediationForm ? 'open' : '')}>
                      <div className={'info-message'}>
                        Si inicias una mediación los serkens pagados en la cita no se ingresarán en la cuenta
                        correspondiente hasta que un administrador lo solucione.
                      </div>
                      <div className={'form-group'}>
                        <label>Explica brevemente que ha pasado:</label>
                        <textarea name={'mediationText'} onChange={this.handleChange} rows={2} maxLength={100}
                                  value={mediationText}/>
                      </div>
                    </div>
                  </React.Fragment>
                }
                <div className={'actions'}>
                  <div className={'close'} onClick={handleClose}>Cancelar</div>
                  <div className={'send'} onClick={this.putReview}>Envíar</div>
                </div>
              </div>)}
            {error && <div className={'review-modal-message'}>Ya has valorado este servicio anteriormente.</div>}
          </React.Fragment>
        }
      </Modal>
    );
  }
}

export default withAuth(ReviewModal);