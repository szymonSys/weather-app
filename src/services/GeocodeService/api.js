import axios from "axios";
import {
  GEOCODER_API_BASE_URL as baseUrl,
  GEOCODER_API_KEY as key,
} from "../../static";

import { handleAsync } from "../../utils";

const config = { baseUrl, key };

export class GeocodeApi {
  baseUrl = "";
  key = "";

  constructor({ baseUrl, key } = config) {
    this.baseUrl = baseUrl ?? this.baseUrl;
    this.key = key ?? this.key;
  }

  async getGeoData({ lat, lon }) {
    const params = { access_key: this.key, query: `${lat},${lon}` };
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/reverse`, { params })
    );
    const [geodata] = response?.data?.data || [];
    return geodata;
  }
}

export default new GeocodeApi();
