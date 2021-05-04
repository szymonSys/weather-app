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
  isFetching = false;
  currentCity = null;
  currentCountry = null;
  filter = "";
  api;
  offset = 0;
  limit = 5;
  constructor(api) {
    this.api = api;
    makeObservable(this, {
      country: observable,
      isLoaded: observable,
      isFetching: observable,
      cities: observable,
      filter: observable,
      currentCity: observable,
      currentCountry: observable,
      fetchCitiesForCountry: action.bound,
      setFilter: action.bound,
      setLoadedCity: action.bound,
      setCurrentCity: action.bound,
      filtered: computed,
      sorted: computed,
      loaded: computed,
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

  get loaded() {
    const loadedCities = [];
    for (const city of this.cities) {
      if (!city.isLoaded) {
        return loadedCities;
      }
      loadedCities.push(city);
    }
    return loadedCities;
  }

  setFilter(filter) {
    return (this.filter = String(filter));
  }

  setCities(cities) {
    return (this.cities = Array.isArray(cities) ? cities : [cities]);
  }

  setCurrentCity(city) {
    return (this.currentCity = city);
  }

  setCurrentCountry(country) {
    return (this.currentCountry = country);
  }

  async loadCityWeather(cityId) {
    let loadedCityIndex;
    const loadedCity =
      this.cities.find((city, index) => {
        const isFound = city.id === cityId;
        if (isFound) {
          loadedCityIndex = index;
        }
        return isFound;
      }) || {};

    if (loadedCityIndex === undefined) {
      return;
    }

    const { isLoaded, city, state, country } = loadedCity;

    if (isLoaded) {
      runInAction(() => {
        this.setCurrentCity(loadedCity);
        this.isLoaded = true;
      });
      return;
    }

    const { status, data } = await this.api?.getDataForCity(
      city,
      state,
      country
    );

    if (this.api?.isSuccess(status)) {
      const cities = [...this.cities];
      cities[loadedCityIndex] = { ...data, id: cityId, isLoaded: true };
      runInAction(() => {
        this.setCities(cities);
        this.setCurrentCity(this.cities[loadedCityIndex]);
        this.isLoaded = true;
      });
      this.setCitiesWeatherToStorage(this.cities, country, true);
    }
  }

  async loadCitiesWeather(country = this.currentCountry) {
    const to = this.offset + this.limit;

    const citiesToFetch = this.cities.slice(this.offset, to);

    if (!citiesToFetch?.length) {
      return;
    }

    this.isFetching = true;

    const fullyFetchedQuantity = LocalStorage.getStore("fullyFetchedQuantity");
    const shouldFetch = (fullyFetchedQuantity[country] ?? 0) < to;

    const citiesWeather = shouldFetch
      ? await this.api?.getWeatherForCities(citiesToFetch)
      : this.getCitiesFromStorage(country);

    const cities = [...this.cities];

    citiesWeather?.forEach((city) => {
      if (cities[city.id]) {
        cities[city.id] = city;
      }
    });

    if (shouldFetch) {
      LocalStorage.saveStore({
        fullyFetchedQuantity: { ...fullyFetchedQuantity, [country]: to },
      });
      this.setCitiesWeatherToStorage(cities, country, true);
    }

    runInAction(() => {
      this.setCities(cities);
      this.isFetching = false;
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
      this.limit = 5;
      this.setCurrentCountry(country);
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
