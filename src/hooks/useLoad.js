import { useEffect, useMemo, useContext } from "react";

export default function useLoad(storeContext) {
  const store = useContext(storeContext);

  const { isLoaded: localizationIsLoaded } = store.localization;
  const { isLoaded: countriesIsLoaded } = store.countries;
  const { isLoaded: citiesIsLoaded } = store.cities;
  const { isLoaded: weatherIsLoaded } = store.cityWeather;

  const isLoaded = useMemo(
    () =>
      localizationIsLoaded &&
      countriesIsLoaded &&
      citiesIsLoaded &&
      weatherIsLoaded,
    [localizationIsLoaded, countriesIsLoaded, citiesIsLoaded, weatherIsLoaded]
  );

  useEffect(() => {
    !isLoaded && loadData({ ...store });
  }, []);

  return isLoaded;
}

async function loadData({ localization, countries, cityWeather, cities }) {
  await Promise.resolve(localization?.fetchGeoData());
  await Promise.resolve(countries?.fetchCountries());
  await Promise.resolve(cities?.fetchCitiesForCountry(localization?.country));

  const cityId = cities?.cities.find(
    (city) =>
      city?.city === localization?.locality &&
      city?.state === localization?.region
  )?.id;

  await Promise.resolve(cityWeather?.fetchLocalWeatherData(cityId));
}
