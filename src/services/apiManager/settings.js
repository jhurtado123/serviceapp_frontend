import axios from "axios";

class SettingsApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  getValueFromKey(key) {
    return this.apiClient.get(`/settings/${key}`);
  }


}

const settingsApiClient = new SettingsApiClient();
export default settingsApiClient;