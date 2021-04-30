import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

import { getFilteredMatches } from "../../utils";

import LocalStorage from "../../services/LocalStorage";

export default class SupportedCountriesStore {
  isLoaded = false;
  filter = "";
  countries = [];
  api;

  constructor(api) {
    makeObservable(this, {
      isLoaded: observable,
      countries: observable,
      filter: observable,
      setFilter: action.bound,
      filtered: computed,
      sorted: computed,
      fetchCountries: action.bound,
    });
    this.api = api;
    this.initStorage();
  }

  setCountries(countires) {
    return (this.countries = Array.isArray(countires)
      ? countires
      : [countires]);
  }

  setFilter(filter) {
    return (this.filter = String(filter));
  }

  findCountry(countryName) {
    return this.countries.find((country) => country === countryName);
  }

  get filtered() {
    return getFilteredMatches(this.filter, this.countries);
  }

  get sorted() {
    return [...this.countries].sort();
  }

  async fetchCountries() {
    if (this.isLoaded) {
      return;
    }
    const countriesFromStorage = LocalStorage.getStore("countries");
    const shouldFetch = !countriesFromStorage?.data?.length;
    const { data, status } =
      (shouldFetch
        ? await this.api?.getSupportedCountries()
        : countriesFromStorage) || {};
    const countries = data?.map(({ country }) => country);
    shouldFetch && LocalStorage.saveStore({ countries: { data, status } });
    runInAction(() => {
      this.api?.isSuccess(status) && this.setCountries(countries);
      this.isLoaded = true;
    });
  }

  initStorage() {
    LocalStorage.getStore("countries") ||
      LocalStorage.saveStore({ countries: {} });
  }
}
