import { useContext, useEffect, useCallback, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function CountryView() {
  const { cities } = useContext(storeContext);
  const params = useParams();
  const history = useHistory();

  const intersectionObserverRef = useRef();
  const lastLoadedItemRef = useRef();

  const checkShouldFetchCities = useCallback(
    () => cities.currentCountry !== params.country,
    [cities.currentCountry !== params.country]
  );

  const [shouldLoadCitiesData, setShouldLoadCitiesData] = useState(
    !checkShouldFetchCities()
  );

  useEffect(() => {
    if (checkShouldFetchCities()) {
      cities.fetchCitiesForCountry(params.country, true);
      setShouldLoadCitiesData(true);
    }
  }, [checkShouldFetchCities, params.country, cities]);

  useEffect(() => {
    if (shouldLoadCitiesData) {
      cities.loadCitiesWeather();
      setShouldLoadCitiesData(false);
    }
  }, [shouldLoadCitiesData, cities]);

  const goToCityView = ({ country, state, city, id }) => () =>
    history.push(`/city/${country}/${state}/${city}?cityId=${id}`);

  const setRef = (isLast) => (node) => {
    if (isLast) {
      lastLoadedItemRef.current = node;
    }
  };

  useEffect(() => {
    intersectionObserverRef.current?.disconnect?.();
    intersectionObserverRef.current = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && cities.loadCitiesWeather();
    });
    lastLoadedItemRef.current &&
      intersectionObserverRef.current?.observe?.(lastLoadedItemRef.current);
  }, [cities.loaded.length, cities]);

  return (
    <div>
      <h2>{params?.country}</h2>
      <ul>
        {cities.loaded.map(({ city, state, country, id }, index, array) => (
          <li
            ref={setRef(index === array.length - 1)}
            onClick={goToCityView({ city, state, country, id })}
            style={{ padding: "100px" }}
            key={id}
          >
            {city} {country} {state}
          </li>
        ))}
      </ul>
      {cities.isFetching && <p>fetching...</p>}
    </div>
  );
}

export default observer(CountryView);
