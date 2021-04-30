import { useContext, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const FILTER_TIMEOUT = 1000;

function Search() {
  const { cities, countries, cityWeather } = useContext(storeContext);

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

  const setWeather = (cityId) => () => cityWeather.setWeatherData(cityId);

  const setCountry = (country) => () =>
    cities.fetchCitiesForCountry(country, true);

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
      <input
        value={input}
        onChange={handleInputChange}
        type="text"
        label="search"
        placeholder="write country or city..."
      />
      {countries.sorted.map((country, index) => (
        <div onClick={setCountry(country)} key={index}>
          {country}
        </div>
      ))}
      {cities.sorted.map(({ city, id, state, isLoaded, country }, index) => (
        <div onClick={setWeather(id)} key={index}>
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

export default observer(Search);
