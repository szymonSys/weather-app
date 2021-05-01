import { useContext, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { isFunction } from "../../utils";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const FILTER_TIMEOUT = 1000;

function WithSearch({ renderInput, children }) {
  const { cities, countries, cityWeather } = useContext(storeContext);
  const history = useHistory();

  const [input, setInput] = useState("");

  const setCountryFilter = useCallback(
    _filterBuilder(countries.setFilter, FILTER_TIMEOUT),
    []
  );

  const setCitiesFilter = useCallback(
    _filterBuilder(cities.setFilter, FILTER_TIMEOUT),
    []
  );

  const handleInputChange = (e) => setInput(e.target.value);

  // const setWeather = (cityId) => () => cityWeather.setWeatherData(cityId);

  const goToCityView = ({ city, state, country, id }) => () =>
    history.push(`/city/${country}/${state}/${city}?cityId=${id}`);

  const goToCountryView = (country) => () =>
    history.push(`/country/${country}`);

  // const setCountry = (country) => () =>
  //   cities.fetchCitiesForCountry(country, true);

  useEffect(() => {
    setCountryFilter(input);
    setCitiesFilter(input);
  }, [input]);

  console.log({
    city: cityWeather.weatherData.city,
    filteredCountries: countries.filtered,
    filteredCities: cities.filtered,
  });

  return (
    <div>
      {isFunction(renderInput) &&
        renderInput({ value: input, handleInputChange })}
      {isFunction(children) &&
        children({
          countries: countries.filtered,
          cities: cities.filtered,
          goToCountryView,
          goToCityView,
        })}
      <input
        value={input}
        onChange={handleInputChange}
        type="text"
        label="search"
        placeholder="write country or city..."
      />
      {countries.sorted.map((country, index) => (
        <div onClick={goToCountryView(country)} key={index}>
          {country}
        </div>
      ))}
      {cities.sorted.map(({ city, id, state, isLoaded, country }, index) => (
        <div onClick={goToCityView({ city, state, country, id })} key={index}>
          {city} {country}
        </div>
      ))}
    </div>
    // <Autocomplete
    //   id="autosearch"
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       label="Wyszukaj"
    //       label="Wpisz miasto lub państwo"
    //       variant="outline"
    //     />
    //   )}
    // />
  );
}

function _filterBuilder(setFilter, timeout) {
  let timeoutId;
  return (input) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setFilter(input);
    }, timeout);
  };
}

export default observer(WithSearch);
