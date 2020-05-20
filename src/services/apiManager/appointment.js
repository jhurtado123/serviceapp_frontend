import axios from "axios";

class AppointmentApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  getAppointments() {
    return this.apiClient.get('/appointments');
  }

  getAppointment(id) {
    return this.apiClient.get(`/appointments/${id}`);
  }

  cancelAppointment(id) {
    return this.apiClient.delete(`/appointments/${id}`);
  }


}

const appointmentApiClient = new AppointmentApiClient();
export default appointmentApiClient;