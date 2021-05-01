import React, { useContext, useEffect, useState, useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { getSearchParams } from "../../utils";

function CityView() {
  const [didMount, setDidMount] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const { cities } = useContext(storeContext);
  const { cityId } = getSearchParams(location?.search);

  const isLoaded = useMemo(() => didMount && cities.isLoaded, [
    didMount,
    cities.isLoaded,
  ]);

  useEffect(() => {
    loadData(cityId, params.country, cities.currentCountry);
  }, [cityId, params.country, cities.currentCountry]);

  useEffect(() => {
    setDidMount(true);
  }, []);

  console.log({ currentCountry: cities.currentCountry });

  const {
    city,
    country,
    state,
    current: { weather, pollution },
  } = cities.currentCity || { current: {} };

  async function loadData(cityId, country, currentCountry) {
    country !== currentCountry &&
      (await Promise.resolve(cities.fetchCitiesForCountry(country, true)));
    cities.loadCityWeather(Number(cityId));
  }

  return (
    <>
      {!isLoaded ? (
        <div>loading city...</div>
      ) : (
        <div>
          {city} {country} {state} {weather?.tp} {pollution?.aqius}
        </div>
      )}
    </>
  );
}

export default observer(CityView);
