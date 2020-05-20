import React, {Component} from 'react';
import HeaderWithTitle from "../../components/HeaderWithTitle";
import appointmentApiClient from "../../services/apiManager/appointment";
import REDIRECT from "../../errorRedirects";
import Loading from "../Loading";
import mapboxgl from "mapbox-gl";
import '../../assets/css/views/appointment/appointment.scss';
import {Link} from "react-router-dom";
import {withAuth} from "../../context/AuthContext";
import ProfileIcon from '../../assets/images/icons/profile-purple.png';
import ClockIcon from '../../assets/images/icons/clock-purple.png';
import LocationIcon from '../../assets/images/icons/location-purple.png';
import LoadingBars from "../../components/LoadingBars";



mapboxgl.accessToken = 'pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA';
let map;
let marker;

class Appointment extends Component {

  state = {
    appointment: undefined,
    isLoading: true,
  };

  async componentDidMount() {
    const {history, match: {params}} = this.props;
    if (!params.id) history.push(REDIRECT[404]);
    try {
      const {data: {appointment}} = await appointmentApiClient.getAppointment(params.id);
      this.setState({
        appointment,
        isLoading: false,
      }, () => {

        map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [appointment.location.coordinates[0], appointment.location.coordinates[1]],
          zoom: 14,
          interactive: true,
          scrollZoom: true,
        });
        marker = new mapboxgl.Marker()
          .setLngLat([appointment.location.coordinates[0], appointment.location.coordinates[1]])
          .addTo(map);
        setTimeout(() => map.resize(), 1000);


      })
    } catch (e) {
      history.push(REDIRECT[500])
    }
  }

  handleAppointmentCancel = async () => {
    const {history, user} = this.props;
    const {appointment} = this.state;
    await appointmentApiClient.cancelAppointment(appointment._id);
    if (user._id === appointment.buyer._id) {
      user.wallet.tokens += appointment.pendingTokens;
    }
    history.push('/appointments');
  };

  getYYYMMDDHHMMDate(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${
      (date.getMonth()+1).toString().padStart(2, '0')}/${
      date.getDate().toString().padStart(2, '0')}/${
      date.getFullYear().toString().padStart(4, '0')} ${
      (date.getHours()-2).toString().padStart(2, '0')}:${
      date.getMinutes().toString().padStart(2, '0')}`
  }

  componentWillUnmount() {
    map.remove();
  }

  render() {
    const {history, user} = this.props;
    const {appointment, isLoading} = this.state;
    return (
      <React.Fragment>
        <HeaderWithTitle history={history} title={'Cita'}/>
        {
          isLoading ? <LoadingBars/> :
            <React.Fragment>
              <div className={'map-appointment-location'}>
                <div ref={el => this.mapContainer = el} className={'mapContainer'}/>
              </div>
              <div className={'appointment-view container'}>
                <h1>{appointment.ad.name}</h1>
                <div className={'appointment-data'}>
                  <div className={'data-row'}>
                    <img  src={ProfileIcon}/> {user._id === appointment.buyer._id ? appointment.seller.name : appointment.buyer.name}
                  </div>
                  <div className={'data-row'}>
                    <img src={LocationIcon} alt=""/> {appointment.buyer.address}, {appointment.buyer.number} {appointment.buyer.postalcode}
                  </div>
                  <div className={'data-row'}>
                    <img src={ClockIcon} alt=""/> {this.getYYYMMDDHHMMDate(appointment.date)}
                  </div>
                </div>
                <div className={'action-buttons'}>
                  <Link to={`/ad/${appointment.ad._id}`} className={'button-bck-purple '}>Ir al anuncio</Link>
                  <Link to={`/chats/${appointment.chat._id}`} className={'button-bck-purple '}>Ir al chat</Link>
                  <div className={'cancel'} onClick={this.handleAppointmentCancel}>Cancelar cita</div>
                </div>
              </div>
            </React.Fragment>
        }

      </React.Fragment>
    );
  }
}

export default withAuth(Appointment);