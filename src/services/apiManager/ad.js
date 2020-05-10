import axios from "axios";

class AdApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  createAd({name, description, price, number, address, postalCode, category, images, mapCoords, tags}) {
     const formData = new FormData();
     images.forEach(image => {
       formData.append('image', image);
     });
     formData.append('name', name);
     formData.append('description', description);
     formData.append('price', price);
     formData.append('number', number);
     formData.append('address', address);
     formData.append('postalCode', postalCode);
     formData.append('category', category);
     formData.append('lat', mapCoords.lat);
     formData.append('lng', mapCoords.lng);
     formData.append('tags', tags);

    return this.apiClient.post('/ad', formData, {headers: {'Content-Type': 'multipart/form-data'}});
  }

  getAd(id) {
    return this.apiClient.get(`/ad/${id}`);
  }
  getAdImages(id) {
    return this.apiClient.get(`/ad/${id}/images`);
  }

  getAdsFromUser() {
    return this.apiClient.get('/ad/user');
  }

}

const adApiClient = new AdApiClient();
export default adApiClient;