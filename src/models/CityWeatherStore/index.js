import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

export default class CityWeatherStore {
  weatherData = {};
  isLoaded = false;
  geoData;
  api;
  cities;

  constructor({ geoData, cities, api }) {
    this.api = api;
    this.geoData = geoData;
    this.cities = cities;
    makeObservable(this, {
      weatherData: observable,
      isLoaded: observable,
      fetchWeatherData: action.bound,
      setWeatherData: action.bound,
    });
  }

  setWeather(weatherData) {
    return (this.weatherData = weatherData);
  }

  async fetchWeatherData({ city, state, country, id }) {
    this.isLoaded = false;
    const { status, data } =
      (await this.api?.getDataForCity(city, state, country)) || {};
    runInAction(() => {
      if (this.api?.isSuccess(status)) {
        const cityWithWeather = { ...data, id, isLoaded: true };
        this.setWeather(cityWithWeather);
        this.cities?.setLoadedCity(cityWithWeather, country);
        this.isLoaded = true;
      }
      this.isLoaded = true;
    });
  }

  setWeatherData(cityId) {
    const cityData = this.cities?.findCity(cityId);
    const { isLoaded, city, state, country, id } = cityData;
    if (isLoaded) {
      runInAction(() => {
        this.setWeather(cityData);
        this.cities?.setCurrentCityId(id);
      });
      return;
    }
    this.fetchWeatherData({ city, state, country, id });
  }

  async fetchLocalWeatherData(id) {
    !this.geoData.isLoaded && (await this.geoData.fetchGeoData());
    let { country, state, city } = this.geoData.localization;
    if (!city) {
      const { status, data } =
        (await this.api?.getCitiesForState(country, state)) || {};
      city = this.api?.isSuccess(status) ? data[0]?.city : city;
    }
    city && this.fetchWeatherData({ city, country, state, id });
  }
}
