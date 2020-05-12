import axios from "axios";

class SearchApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  search(params) {
    const {search, maxRadius, maxPrice, category, orderBy} = params;
    return this.apiClient.get('/search', { params: { search, maxRadius, maxPrice, category, orderBy}});
  }

}

const searchApiClient = new SearchApiClient();
export default searchApiClient;