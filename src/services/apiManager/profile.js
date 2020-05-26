import axios from "axios";

class ProfileApiClient {
  constructor() {
    this.apiClient =  axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URI,
      withCredentials: true,
    });
  }

  getProfile() { 
    return this.apiClient.get("/whoami");
  }

  getProfileOtherUser(username){
    return this.apiClient.get(`/profile/user/${username}`)
  }

  getLevel() {
    return this.apiClient.get("/profile/level");
  }

  getAds() {
    return this.apiClient.get('/profile/ads');
  }

  getRemovedAds() {
    return this.apiClient.get('/profile/ads/removed');
  }

  updateProfile({ name, description, address, number, postalcode, mapCoords, images}) {
    const formData = new FormData();
    if(images[0] !== ''){
      images.forEach(image => {
        formData.append('image', image);
      });
    }
    formData.append('name', name);
    formData.append('description', description);
    formData.append('number', number);
    formData.append('address', address);
    formData.append('postalcode', postalcode);
    formData.append('lat', mapCoords.lat);
    formData.append('lng', mapCoords.lng);

    return this.apiClient.put('/profile/edit', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  addToRecentlyViewed(id) {
    return this.apiClient.put(`/profile/ad/${id}`)
  }

  notificationsReaded() {
    return this.apiClient.put(`/profile/notifications/`)
  }

  buyTokens(quantity) {
    return this.apiClient.put('/profile/buyTokens', {quantity});
  }

  putReview({appointment, valoration, stars, mediationText, showMediationForm}) {
    return this.apiClient.put('/profile/setReview', {appointment, valoration, stars, mediationText, showMediationForm});
  }
}


const profileApiClient = new ProfileApiClient();
export default profileApiClient;