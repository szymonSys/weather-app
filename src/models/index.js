import React from "react";
import CityWeatherStore from "./CityWeatherStore";
import CountryCitiesStore from "./CountryCitiesStore";
import SupportedCountriesStore from "./SupportedCountriesStore";
import GeoDataStore from "./GeoDataStore";
import weatherApi from "../services/WeatherService/api";
import geocodeApi from "../services/GeocodeService/api";

export const supportedCountriesStore = new SupportedCountriesStore(weatherApi);
export const geoDataStore = new GeoDataStore(geocodeApi);
export const countryCitiesStore = new CountryCitiesStore(weatherApi);
export const cityWeatherStore = new CityWeatherStore({
  geoData: geoDataStore,
  cities: countryCitiesStore,
  api: weatherApi,
});

class RootStore {
  constructor({
    countryCitiesStore,
    cityWeatherStore,
    supportedCountriesStore,
    geoDataStore,
  } = {}) {
    this.cities = countryCitiesStore;
    this.cityWeather = cityWeatherStore;
    this.countries = supportedCountriesStore;
    this.localization = geoDataStore;
  }
}

export const store = new RootStore({
  countryCitiesStore,
  cityWeatherStore,
  supportedCountriesStore,
  geoDataStore,
});

export const storeContext = React.createContext();

export const StoreProvider = ({ children }) => (
  <storeContext.Provider value={store}>{children}</storeContext.Provider>
);
