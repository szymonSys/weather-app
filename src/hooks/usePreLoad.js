import { useEffect, useContext, useState } from "react";
import usePrevious from "../hooks/usePrevious";

export default function usePreLoad(storeContext) {
  const store = useContext(storeContext);

  const [isLoaded, setIsLoaded] = useState(
    store.localization.isLoaded &&
      store.countries.isLoaded &&
      store.cities.isLoaded &&
      store.cityWeather.isLoaded
  );

  const prevCoordinates = usePrevious(store.localization.coordinates);

  useEffect(() => {
    if (!isLoaded || prevCoordinates !== store.localization.coordinates) {
      loadData({ ...store });
      setIsLoaded(true);
    }
  }, [isLoaded, store.localization.coordinates]);

  return isLoaded;
}
async function loadData({ localization, countries, cityWeather, cities }) {
  await Promise.resolve(localization?.fetchGeoData(true));
  await Promise.resolve(countries?.fetchCountries());
  await Promise.resolve(cities?.fetchCitiesForCountry(localization?.country));

  const cityId = cities?.cities.find(
    (city) =>
      city?.city === localization?.locality &&
      city?.state === localization?.region
  )?.id;

  await Promise.resolve(cityWeather?.fetchLocalWeatherData(cityId));
}
