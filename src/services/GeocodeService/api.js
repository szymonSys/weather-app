import axios from "axios";
import {
  GEOCODER_API_BASE_URL as baseUrl,
  GEOCODER_API_KEY as key,
} from "../../static";

import { handleAsync } from "../../utils";

const defaultGeodata = Object.freeze({
  locality: "Warsaw",
  country: "Poland",
  region: "Mazovia",
  coords: { lat: 52.229676, lon: 21.012229 },
});

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
      axios.get(`${this.baseUrl}/reverse`, { params }),
      defaultGeodata
    );
    const [geodata] = response?.data?.data || [defaultGeodata];
    return geodata;
  }
}

export default new GeocodeApi();
