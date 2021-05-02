import axios from "axios";
import {
  WEATHER_API_BASE_URL as baseUrl,
  WEATHER_API_KEYS as keys,
} from "../../static";
import { handleAsync } from "../../utils";

const headers = {
  // "Access-Control-Allow-Origin": baseUrl,
  Accept: "*/*",
  "Content-Type": "application/json",
};

export class WeatherApi {
  baseUrl = "";
  keys = "";
  requestsQuantity = 0;
  geocodeService;

  constructor({ baseUrl, keys } = {}) {
    this.baseUrl = baseUrl ?? this.baseUrl;
    this.keys = keys ?? this.keys;
    this._resetRequestsQuantity();
  }

  async getSupportedCountries() {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/countries`, {
        params: { key: this._getKey() },
        headers,
      }),
      this.incrementRequestsQuantity()
    );

    return response?.data;
  }

  async getSupportedStatesForCountry(country) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/states`, {
        params: { country, key: this._getKey() },
        headers,
      }),
      this.incrementRequestsQuantity()
    );

    return response?.data;
  }

  async getCitiesForState(country, state) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/cities`, {
        params: {
          country,
          state,
          key: this._getKey(),
        },
        headers,
      }),
      this.incrementRequestsQuantity()
    );

    const { data, status } = response?.data || {};

    return this.isSuccess(status)
      ? data?.map(({ city }) => ({ city, country, state }))
      : [];
  }

  async getCities(country) {
    const { status, data: states } =
      (await this.getSupportedStatesForCountry(country)) || {};

    if (!this.isSuccess(status)) {
      return await Promise.resolve([]);
    }

    const cities = await Promise.all(
      states.map((state) => this.getCitiesForState(country, state?.state))
    ).catch((error) => console.error(error));

    return WeatherApi.mapCities(WeatherApi.flatCities(cities));
  }

  async getDataForCity(city, state, country) {
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/city`, {
        params: { city, country, state, key: this._getKey() },
        headers,
      }),
      this.incrementRequestsQuantity()
    );

    return await response?.data;
  }

  async getWeatherForCities(citiesData) {
    const citiesWeather = await Promise.all(
      citiesData.map(async (cityData) => {
        const { city, state, country } = cityData;

        const response = await this.getDataForCity(city, state, country);

        return this.mapResponse({ ...response }, cityData);
      })
    ).catch((error) => console.error(error));

    return citiesWeather;
  }

  incrementRequestsQuantity() {
    this.requestsQuantity++;
  }

  _resetRequestsQuantity(interval = 60000) {
    setInterval(() => (this._resetRequestsQuantity = 0), interval);
  }

  _getKey() {
    return this.keys[this.requestsQuantity % this.keys.length];
  }

  async getDataForLocalization({ lat, lon } = {}) {
    const params =
      (lat && lon) !== undefined
        ? { key: this._getKey(), lat, lon }
        : { key: this._getKey() };
    const response = await handleAsync(
      axios.get(`${this.baseUrl}/nearest_station`, { params }),
      this.incrementRequestsQuantity()
    );

    return response?.data;
  }

  isSuccess(status) {
    return /^success$/.test(status);
  }

  static mapCities(cities) {
    return cities.map((city, id) => ({
      ...city,
      id,
      isLoaded: false,
    }));
  }

  static withTimeout(callback, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(callback()), timeout);
    });
  }

  static flatCities(cities) {
    return (Array.isArray(cities) ? cities : [cities]).flat();
  }

  mapResponse({ data, status }, cityData) {
    return this.isSuccess(status) && data
      ? { ...cityData, ...data, isLoaded: true }
      : { ...cityData };
  }
}

export default new WeatherApi({
  baseUrl,
  keys,
});
