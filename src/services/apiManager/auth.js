import axios from "axios";

class AuthApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  login(body) {
    return this.apiClient.post("/login", body);
  }

  logout() {
    return this.apiClient.get("/logout");
  }

  doesUsernameExist(username) {
    return this.apiClient.post('/doesUsernameExist', username);
  }

  whoami() {
    return this.apiClient.get("/whoami");
  }

  signup(body) {
    return this.apiClient.post('/signup', body);
  }

}

const authApiClient = new AuthApiClient();
export default authApiClient;