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

  constructor(geoData, api) {
    this.api = api;
    this.geoData = geoData;
    makeObservable(this, {
      weatherData: observable,
      isLoaded: observable,
      fetchWeatherData: action.bound,
    });
  }

  setWeather(weatherData) {
    return (this.weatherData = weatherData);
  }

  fetchWeatherData({ city, state, country }) {
    this.isLoaded = false;
    const { status, data } =
      this.api?.getDataForCity(city, state, country) || {};
    runInAction(() => {
      this.api?.isSuccess(status) && this.setWeather(data);
      this.isLoaded = true;
    });
  }

  fetchLocalWeatherData() {
    this.geoData.fetchGeoData();
    let { country, state, city } = this.geoData.localization;
    if (!city) {
      const { status, data } =
        this.api?.getCitiesForState(country, state) || {};
      city = this.api?.isSuccess(status) ? data[0]?.city : city;
    }
    city && this.fetchWeatherData({ city, country, state });
  }
}
