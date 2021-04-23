import axios from "axios";
import {
  WEATHER_API_BASE_URL as baseUrl,
  WEATHER_API_KEY as key,
} from "../../static";
import { handleAsync } from "../../utils";

export class WeatherApi {
  baseUrl = "";
  key = "";
  geocodeService;

  constructor({ baseUrl, key } = {}) {
    this.baseUrl = baseUrl ?? this.baseUrl;
    this.key = key ?? this.key;
  }

  async getSupportedCountries() {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/countries`, {
        params: { key: this.key },
      })
    );

    return response?.data;
  }

  async getSupportedStatesForCountry(country) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/states`, {
        params: { country, key: this.key },
      })
    );

    return response?.data;
  }

  async getCitiesForState(country, state) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/cities`, {
        params: { country, state, key: this.key },
      })
    );

    const { data, status } = response?.data || {};
    return this.isSuccess(status) ? WeatherApi.mapCities(state)(data) : [];
  }

  async getCities(country) {
    const { status, data: states } =
      this.getSupportedStatesForCountry(country) || {};

    if (!this.isSuccess(status)) {
      return await Promise.resolve([]);
    }

    const cities = await Promise.all(
      states.map((state) => this.getCitiesForState(country, state))
    ).catch((error) => console.error(error));

    return WeatherApi.flatCities(cities);
  }

  async getDataForCity(city, state, country) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/city`, {
        params: { city, country, state, key: this.key },
      })
    );

    return response?.data;
  }

  async getDataForLocalization({ lat, lon } = {}) {
    const params =
      (lat && lon) !== undefined
        ? { key: this.key, lat, lon }
        : { key: this.key };
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/nearest_station`, { params })
    );

    return response?.data;
  }

  isSuccess(status) {
    return /^success$/.test(status);
  }

  static mapCities(state) {
    return (cities) => cities.map(({ city }) => ({ state, city }));
  }

  static flatCities(cities) {
    return new Set([...(Array.isArray(cities) ? cities : [cities]).flat()]);
  }
}

export default new WeatherApi({
  baseUrl,
  key,
});
