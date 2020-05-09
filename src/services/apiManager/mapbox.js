import axios from "axios";

class MapboxApiClient {
  constructor() {
    this.apiClient = axios.create({
      baseURL: 'https://api.mapbox.com',
    });
  }

  getCoordinates({address, number, postalCode}) {
    return this.apiClient.get(`/geocoding/v5/mapbox.places/${address} ${number}, ${postalCode}.json?access_token=pk.eyJ1Ijoiamh1cnRhZG8xMjMiLCJhIjoiY2s3dGlqZWtlMHFveTNvbjF1bjJxYTg2ayJ9.zbzGWyoeQ52ddJTrK2gjdA&country=es&limit=1`);
  }

}

const mapBoxApiClient = new MapboxApiClient();
export default mapBoxApiClient;