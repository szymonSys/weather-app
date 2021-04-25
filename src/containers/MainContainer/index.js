import { useContext, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function MainContainer({ children }) {
  const store = useContext(storeContext);

  const { isLoaded: localizationIsLoaded } = store.localization;
  const { isLoaded: countriesIsLoaded } = store.countries;
  const { isLoaded: citiesIsLoaded } = store.cities;

  const isLoaded = useMemo(
    () => localizationIsLoaded && countriesIsLoaded && citiesIsLoaded,
    [localizationIsLoaded, countriesIsLoaded, citiesIsLoaded]
  );

  useEffect(() => {
    !isLoaded && loadData();
  }, [isLoaded]);

  useEffect(() => {
    console.log({
      weather: store.cityWeather.weatherData.location,
      data: store.cities.cities.find(
        (city) => city === store.localization.city
      ),
    });
  }, [
    store.cityWeather.weatherData,
    store.cities.cities,
    store.localization.city,
  ]);

  async function loadData() {
    await Promise.resolve(store.localization.fetchGeoData());
    await Promise.resolve(store.countries.fetchCountries());
    await Promise.resolve(
      store.cities.fetchCitiesForCountry(store.localization.country)
    );
    await Promise.resolve(store.cityWeather.fetchLocalWeatherData());
    console.log("----------------", {
      weather: store.cityWeather.weatherData.city,
      data: store.cities.cities.find(
        (city) => city === store.localization.city
      ),
    });
  }

  return <>{isLoaded ? children : <div>loading...</div>}</>;
}

export default observer(MainContainer);
