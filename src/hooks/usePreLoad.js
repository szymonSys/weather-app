import { useEffect, useContext, useState } from "react";

export default function usePreLoad(storeContext) {
  const store = useContext(storeContext);

  const [isLoaded, setIsLoaded] = useState(
    store.localization.isLoaded &&
      store.countries.isLoaded &&
      store.cities.isLoaded &&
      store.cityWeather.isLoaded
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
