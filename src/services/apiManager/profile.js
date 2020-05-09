import axios from "axios";

class ProfileApiClient {
  constructor() {
    this.apiClient =  axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  getProfile() { 
    return this.apiClient.get("/profile");
  }

}


const profileApiClient = new ProfileApiClient();
export default profileApiClient;