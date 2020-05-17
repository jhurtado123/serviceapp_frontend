import React, {Component} from 'react';
import BaseLayout from "../layouts/BaseLayout";
import SearchBar from "../../components/SearchBar";
import appointmentApiClient from "../../services/apiManager/appointment";
import REDIRECT from "../../errorRedirects";
import {Link} from 'react-router-dom';
import '../../assets/css/views/appointment/appointments.scss';
import AppointmentBox from "../../components/AppointmentBox";
import {withAuth} from "../../context/AuthContext";


class Appointments extends Component {

  state = {
    search: '',
    appointments: [],
  };

  async componentDidMount() {
    const {history} = this.props;
    try {
      const {data: {appointments}} = await appointmentApiClient.getAppointments();
      this.setState({
        appointments
      })
    } catch (e) {
      history.push(REDIRECT[500]);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  printAppointments = () => {
    const {appointments, search} = this.state;
    const {user} = this.props;
    return appointments.map((appointment, index) => {
      if (!search) return <AppointmentBox key={index} appointment={appointment}
                                          user={appointment.buyer._id === user._id ? appointment.seller : appointment.buyer}/>;
      if (appointment.ad.name.includes(search)) {
        return <AppointmentBox key={index} appointment={appointment}
                               user={appointment.buyer._id === user._id ? appointment.seller : appointment.buyer}/>;
      }
    })
  };

  render() {
    const {search, appointments} = this.state;
    return (
      <BaseLayout>
        <SearchBar placeholder={'Buscar por anuncio'} searchValue={search} handleChange={this.handleChange} />
        <div className={'appointments-list'}>
          {appointments.length ?
            <div className={'appointments-list-container container'}>
              {this.printAppointments()}
            </div>:
            <div className={'page-message'}>
              <p>¡No tienes citas activas!</p>
              <Link to={'/'} className={'button-bck-purple'}>Volver a la home</Link>
            </div>

          }
        </div>
      </BaseLayout>
    );
  }
}

export default withAuth(Appointments);