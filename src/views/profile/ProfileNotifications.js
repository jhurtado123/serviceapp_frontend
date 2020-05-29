import React, {Component} from 'react';
import {withAuth} from "../../context/AuthContext";
import HeaderWithTitle from "../../components/HeaderWithTitle";
import Notification from "../../components/Notification";
import SearchBar from "../../components/SearchBar";
import profileApiClient from "../../services/apiManager/profile";
import REDIRECT from "../../errorRedirects";
import LoadingBars from "../../components/LoadingBars";
import ReviewModal from "../../components/ReviewModal";


class ProfileNotifications extends Component {
  state = {
    notifications: [],
    search: '',
    modalAppointmentId: '',
    isLoading: true,
    showModal: false,
  };

  componentDidMount = () => {
    this.getProfile()
  };

  handleSearch = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleModalClose = () => {
    this.setState({
      showModal: false,
    })
  };

  handleModalShow = (appointmentId) => {
    this.setState({
      showModal:true,
      modalAppointmentId: appointmentId,
    })
  };

  async getProfile() {
    try {
      const {data} = await profileApiClient
        .getProfile();
      const notifications = data.notifications.reverse();
      this.setState({
        notifications,
        isLoading:false,
      });
      profileApiClient.notificationsReaded()
    } catch (error) {
      if (error.response) {
        this.props.history.push(REDIRECT[error.response.status]);
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  }

  displayNotifications = () => {
    const {notifications, search} = this.state;
    return notifications.map((notification, i) => {
      if ((search && notification.title.toLowerCase().includes(search.toLowerCase())) || !search) {
        console.log(notification)
        return (
          <Notification
            showModal={this.handleModalShow}
            key={i}
            title={notification.title}
            isReaded={notification.isReaded}
            href={notification.href}
            date={notification.createdAt}
            type={notification.type}
          />
        )
      }
    })
  };

  render() {
    const {search, isLoading, showModal, modalAppointmentId} = this.state;
    return (
      <div>
        <HeaderWithTitle title="Notificaciones"/>
        <SearchBar placeholder={'Buscar notificaciones'} searchValue={search} handleChange={this.handleSearch}/>
        {isLoading ? <LoadingBars/> :
          <div className={'notifications-container'}>
            {this.displayNotifications()}
          </div>
        }
        <ReviewModal appointmentId={modalAppointmentId} show={showModal} handleClose={this.handleModalClose}/>
      </div>
    )
  }
}


export default withAuth(ProfileNotifications);