import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

export default function usePreLoad(storeContext) {
  const store = useContext(storeContext);
  const location = useLocation();

  const [isLoaded, setIsLoaded] = useState(
    store.localization && store.countries && store.cities && store.cityWeather
  );

  useEffect(() => {
    if (!isLoaded) {
      loadData({ ...store });
      setIsLoaded(true);
    }
  }, [isLoaded]);

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
