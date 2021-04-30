import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

function Search() {
  const { cities, countries, cityWeather } = useContext(storeContext);
  console.log({ city: cityWeather.weatherData.city });
  const setWeather = (cityId) => () => cityWeather.setWeatherData(cityId);
  const setCountry = (country) => () =>
    cities.fetchCitiesForCountry(country, true);
  return (
    <div>
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

export default observer(Search);
