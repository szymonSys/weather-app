import { useContext, useEffect, useCallback, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import useLazyLoad from "../../hooks/useLazyLoad";
import City from "./City";

function CountryView() {
  const { cities } = useContext(storeContext);
  const params = useParams();
  const history = useHistory();

  const checkShouldFetchCities = useCallback(
    () => cities.currentCountry !== params.country,
    [cities.currentCountry, params.country]
  );

  const [shouldLoadCitiesData, setShouldLoadCitiesData] = useState(
    !checkShouldFetchCities()
  );

  const setRef = useLazyLoad(cities.loadCitiesWeather.bind(cities), [
    cities.loaded.length,
    cities,
  ]);

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

  return (
    <div>
      <h2>{params?.country}</h2>
      <ul>
        {cities.loaded.map((data, index, array) => (
          <City
            key={data?.id}
            setRef={setRef}
            isLast={index === array.length - 1}
            onClick={goToCityView({
              city: data?.city,
              state: data?.state,
              country: data?.country,
              id: data?.id,
            })}
            data={data}
          />
        ))}
      </ul>
      {cities.isFetching && <p>fetching...</p>}
    </div>
  );
}

export default observer(CountryView);
