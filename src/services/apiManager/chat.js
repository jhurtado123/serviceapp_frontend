import axios from "axios";

class ChatApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  createAd(adId) {
    return this.apiClient.post('/chats', {adId});
  }

  getChat(id) {
    return this.apiClient.get(`/chats/${id}`);
  }

}

const chatApiClient = new ChatApiClient();
export default chatApiClient;