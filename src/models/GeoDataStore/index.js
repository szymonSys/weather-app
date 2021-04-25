import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";

export default class GeoDataStore {
  coordinates = { lat: null, lon: null };
  locality = "";
  country = "";
  region = "";
  isLoaded = false;
  geocodeService;

  constructor(geocodeService, { lat, lon } = {}) {
    this.geocodeService = geocodeService;

    makeObservable(this, {
      coordinates: observable,
      locality: observable,
      country: observable,
      region: observable,
      isLoaded: observable,
      localization: computed,
      fetchGeoData: action.bound,
    });

    (lat && lon) !== undefined
      ? this.setCoordinates({ lat, lon })
      : this.getDeviceCoordinates();
  }

  setCoordinates({ lat, lon } = {}) {
    return (this.coordinates = { lat, lon });
  }

  setIsLoaded(isLoaded) {
    return (this.isLoaded = isLoaded);
  }

  setLocality(locality) {
    return (this.locality = locality);
  }

  setCountry(country) {
    return (this.country = country);
  }

  setRegion(region) {
    return (this.region = region);
  }

  getDeviceCoordinates() {
    navigator &&
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lon } = position.coords || {};
        this.setCoordinates({ lat, lon });
      });
  }

  get localization() {
    return {
      lat: this.coordinates.lat,
      lon: this.coordinates.lon,
      city: this.locality,
      country: this.country,
      state: this.region,
    };
  }

  async fetchGeoData() {
    if (this.isLoaded) {
      return;
    }

    const {
      coordinates: { lat, lon },
    } = this;
    const { locality, country, region } =
      (await this.geocodeService?.getGeoData({ lat, lon })) || {};

    runInAction(() => {
      locality && this.setLocality(locality);
      country && this.setCountry(country);
      region && this.setRegion(region);
      this.setIsLoaded(true);
    });
  }
}
