import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

import { getFilteredMatches } from "../../utils";

export default class CountryCitiesStore {
  country = "";
  cities = [];
  isLoaded = false;
  filter = "";
  api;
  constructor(api) {
    this.api = api;
    makeObservable(this, {
      country: observable,
      isLoaded: observable,
      cities: observable,
      filter: observable,
      fetchCitiesForCountry: action.bound,
      filtered: computed,
      sorted: computed,
    });
  }

  get sorted() {
    return [...this.cities.sort()];
  }

  get filtered() {
    return getFilteredMatches(this.filter, this.cities);
  }

  setCities(cities) {
    this.cities = Array.isArray(cities) ? cities : [cities];
  }

  findCity(cityName) {
    return this.cities.find(({ name }) => name === cityName);
  }

  fetchCitiesForCountry(country) {
    this.isLoaded = false;
    const cities = this.api?.getCities(country);
    runInAction(() => {
      this.setCities(cities);
      this.isLoaded = true;
    });
  }
}
