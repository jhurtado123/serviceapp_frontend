import axios from "axios";

class CategoriesApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  getAllCategories() {
    return this.apiClient.get('/categories');
  }

}

const categoriesApiClient = new CategoriesApiClient();
export default categoriesApiClient;