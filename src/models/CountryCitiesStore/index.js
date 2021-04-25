import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

export default class CountryCitiesStore {
  country = "";
  cities = [];
  isLoaded = false;
  isFething = false;
  currentCityId = null;
  filter = "";
  api;
  offset = 0;
  limit = 10;
  constructor(api) {
    this.api = api;
    makeObservable(this, {
      country: observable,
      isLoaded: observable,
      isFething: observable,
      cities: observable,
      filter: observable,
      currentCityId: observable,
      fetchCitiesForCountry: action.bound,
      setFilter: action.bound,
      setLoadedCity: action.bound,
      setCurrentCityId: action.bound,
      filtered: computed,
      sorted: computed,
    });
  }

  get sorted() {
    return [...this.cities.sort()];
  }

  get filtered() {
    return this.cities
      .filter((item) => item?.city?.includes(this.filter))
      .sort(
        (a, b) => a?.city?.indexOf(this.filter) - b?.city?.indexOf(this.filter)
      );
  }

  setFilter(filter) {
    return (this.filter = String(filter));
  }

  setCities(cities) {
    return (this.cities = Array.isArray(cities) ? cities : [cities]);
  }

  setCurrentCityId(id) {
    return (this.currentCityId = id);
  }

  async loadCitiesWeather() {
    const citiesToFetch = this.cities.slice(
      this.offset,
      this.offset + this.limit
    );
    if (!citiesToFetch.length) {
      return;
    }

    this.isFething = true;

    const citiesWeather = await this.api?.getWeatherForCities(citiesToFetch);
    const cities = [...this.cities];

    citiesWeather?.forEach((city) => {
      if (cities[city.id]) {
        cities[city.id] = city;
      }
    });

    runInAction(() => {
      this.setCities(cities);
      this.isFething = false;
      this.offset += this.limit;
    });
  }

  findCity(cityId) {
    return this.cities.find(({ id }) => id === cityId);
  }

  filterByName(cityName) {
    return this.cities.filter((city) => city.name === cityName);
  }

  filterByState(cityState) {
    return this.cities.filter((city) => city.state === cityState);
  }

  getLoaded(isLoaded = true) {
    return this.cities.filter((city) => city.isLoaded === isLoaded);
  }

  checkIsWeatherLoaded(cityId) {
    return !!this.cities.find((city) => city.id === cityId)?.isLoaded;
  }

  setLoadedCity(city) {
    if (!city?.id) {
      return;
    }
    const cities = [this.cities];
    if (cities[city.id]) {
      cities[city.id] = city;
    }
    this.setCities(cities);
  }

  async fetchCitiesForCountry(country) {
    this.isLoaded = false;
    const cities = await this.api?.getCities(country);
    runInAction(() => {
      this.setCities(cities);
      this.isLoaded = true;
      this.offset = 0;
      this.limit = 10;
    });
  }
}
