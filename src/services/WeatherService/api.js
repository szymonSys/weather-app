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
    return this.isSuccess(status)
      ? WeatherApi.mapCities(state, country)(data)
      : [];
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

  async getWeatherForCities(citiesData) {
    const citiesWeather = await Promise.all(
      citiesData.map((cityData) => {
        const { city, state, country } = cityData;
        return WeatherApi.mapResponse(
          this.getDataForCity(city, state, country),
          cityData
        );
      })
    ).catch((error) => console.error(error));

    return citiesWeather;
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

  static mapCities(state, country) {
    return (cities) =>
      cities.map(({ city }, id) => ({
        country,
        state,
        city,
        id,
        isLoaded: false,
      }));
  }

  static flatCities(cities) {
    return (Array.isArray(cities) ? cities : [cities]).flat();
    // return new Set([...(Array.isArray(cities) ? cities : [cities]).flat()]);
  }

  static mapResponse({ data, status }, cityData) {
    return this.isSuccess(status) && data
      ? { ...cityData, ...data, isLoaded: true }
      : { ...cityData };
  }
}

export default new WeatherApi({
  baseUrl,
  key,
});
