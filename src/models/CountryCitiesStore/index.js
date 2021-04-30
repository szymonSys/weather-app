import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

import LocalStorage from "../../services/LocalStorage";

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
    this.initStorage();
  }

  get sorted() {
    return [...this.cities].sort((a, b) => (a?.city < b?.city ? -1 : 1));
  }

  get filtered() {
    const lowerCaseFilter = this.filter?.toLowerCase();
    return this.cities
      .filter((item) => item?.city?.toLowerCase()?.includes(lowerCaseFilter))
      .sort(
        (a, b) =>
          a?.city?.toLowerCase()?.indexOf(lowerCaseFilter) -
          b?.city?.toLowerCase()?.indexOf(lowerCaseFilter)
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

  async loadCitiesWeather(country) {
    const to = this.offset + this.limit;
    const citiesToFetch = this.cities.slice(this.offset, to);
    if (!citiesToFetch?.length) {
      return;
    }

    this.isFething = true;

    const fullyFetchedQuantity = LocalStorage.getStore("fullyFetchedQuantity");
    const shouldFetch = fullyFetchedQuantity[country] ?? 0 >= to;

    const citiesWeather = shouldFetch
      ? await this.api?.getWeatherForCities(citiesToFetch)
      : this.getCitiesFromStorage(country);

    shouldFetch &&
      LocalStorage.saveStore({
        fullyFetchedQuantity: { ...fullyFetchedQuantity, [country]: to },
      });

    const cities = [...this.cities];

    citiesWeather?.forEach((city) => {
      if (cities[city.id]) {
        cities[city.id] = city;
      }
    });

    runInAction(() => {
      this.setCities(cities);
      this.isFething = false;
      this.offset = to;
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

  setLoadedCity(city, country) {
    if (!city?.id) {
      return;
    }
    const cities = [...this.cities];
    if (cities[city.id]) {
      cities[city.id] = city;
    }
    this.setCitiesWeatherToStorage(cities, country, true);
    this.setCities(cities);
  }

  async fetchCitiesForCountry(country, reLoad = false) {
    if (this.isLoaded && !reLoad) {
      return;
    }
    this.isLoaded = false;
    const citiesFromStorage = this.getFromStorage(country);
    const shouldFetch = !citiesFromStorage?.length;
    const cities = shouldFetch
      ? await this.api?.getCities(country)
      : citiesFromStorage;
    runInAction(() => {
      this.setCities(cities);
      this.isLoaded = true;
      this.offset = 0;
      this.limit = 10;
    });

    shouldFetch && this.saveToStorage(cities, country);
  }

  initStorage() {
    LocalStorage.getStore("cities") || LocalStorage.saveStore({ cities: {} });
    LocalStorage.getStore("fullyFetchedQuantity") ||
      LocalStorage.saveStore({ fullyFetchedQuantity: {} });
  }

  getCitiesFromStorage(country) {
    return LocalStorage.getStore("cities")[country]?.slice(
      this.offset,
      this.limit + this.offset
    );
  }

  getFromStorage(country) {
    const citiesStorage = LocalStorage.getStore("cities");
    return citiesStorage && LocalStorage.getStore("cities")[country];
  }

  saveToStorage(cities, country, override = false) {
    const citiesFromStorage = LocalStorage.getStore("cities");
    if (citiesFromStorage[country]?.length && !override) {
      return;
    }
    LocalStorage.saveStore({
      cities: { ...citiesFromStorage, [country]: cities },
    });
  }

  setCitiesWeatherToStorage(cities, country, isAll = false) {
    if (isAll) {
      this.saveToStorage(cities, country, true);
      return;
    }
    const citiesFromStorage = this.getFromStorage(country);
    const updatedCities = Array.isArray(citiesFromStorage)
      ? [...citiesFromStorage]
      : [];
    cities?.forEach((city) => {
      let foundIndex;
      const foundCity = citiesFromStorage?.find(({ id, isLoaded }, index) => {
        const isFound = !isLoaded && id && id === city?.id;
        if (isFound) {
          foundIndex = index;
        }
        return isFound;
      });
      if (foundCity) {
        updatedCities[foundIndex] = { ...updatedCities[foundIndex], ...city };
      }
    });

    this.saveToStorage(updatedCities, country, true);
    return updatedCities;
  }
}
