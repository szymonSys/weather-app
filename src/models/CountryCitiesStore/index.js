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
    const to = this.offset + this.limit;
    const citiesToFetch = this.cities.slice(this.offset, to);
    if (!citiesToFetch?.length) {
      return;
    }

    this.isFething = true;

    const shouldFetch =
      LocalStorage.getStore("fullyFetchedQuantity") ?? 0 >= to;

    const citiesWeather = shouldFetch
      ? await this.api?.getWeatherForCities(citiesToFetch)
      : this.getCitiesFromStorage();

    shouldFetch && LocalStorage.saveStore({ fullyFetchedQuantity: to });

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

  setLoadedCity(city) {
    if (!city?.id) {
      return;
    }
    const cities = [...this.cities];
    if (cities[city.id]) {
      cities[city.id] = city;
    }
    this.setCitiesWeatherToStorage(cities, true);
    this.setCities(cities);
  }

  saveToStorage(cities) {
    LocalStorage.saveStore({ cities: cities ?? this.cities });
    LocalStorage.saveStore({ fullyFetchedQuantity: this.offset });
  }

  getFromStorage() {
    return LocalStorage.getStore("cities");
  }

  setCitiesWeatherToStorage(cities, isAll = false) {
    if (isAll) {
      this.saveToStorage(cities);
    }
    const citiesFromStorage = this.getFromStorage();
    const updatedCities = [...citiesFromStorage];
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

    this.saveToStorage(updatedCities);
    return updatedCities;
  }

  getCitiesFromStorage() {
    return LocalStorage.getStore("cities")?.slice(
      this.offset,
      this.limit + this.offset
    );
  }

  async fetchCitiesForCountry(country) {
    if (this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const citiesFromStorage = this.getFromStorage();
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

    shouldFetch && this.saveToStorage(cities);
  }
}
