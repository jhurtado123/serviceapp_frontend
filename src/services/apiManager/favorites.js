import axios from "axios";

class FavoritesApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  addFavorite(id) {
    return this.apiClient.put(`/favorites/${id}`);
  }

  getFavorites() {
    return this.apiClient.get(`/favorites`);
  }

  removeFromFavorites(id) {
    return this.apiClient.delete(`/favorites/${id}`);
  }


}

const favoritesApiClient = new FavoritesApiClient();
export default favoritesApiClient;