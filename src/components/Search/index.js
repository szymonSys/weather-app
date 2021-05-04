import { useContext, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { isFunction } from "../../utils";
import { Box } from "@material-ui/core";

const FILTER_TIMEOUT = 300;

function WithSearch({ renderInput, children }) {
  const { cities, countries } = useContext(storeContext);
  const history = useHistory();

  const [input, setInput] = useState("");
  const [shouldDisplay, setShouldFilter] = useState(false);

  const setCountryFilter = useCallback(
    _filterBuilder(filter(countries.setFilter), FILTER_TIMEOUT),
    []
  );

  const setCitiesFilter = useCallback(
    _filterBuilder(filter(cities.setFilter), FILTER_TIMEOUT),
    []
  );

  const handleInputChange = (e) => setInput(e.target.value);

  const goToCityView = ({ city, state, country, id }) => () =>
    history.push(`/city/${country}/${state}/${city}?cityId=${id}`);

  const goToCountryView = (country) => () =>
    history.push(`/country/${country}`, { toTopInMount: true });

  useEffect(() => {
    setCountryFilter(input);
    setCitiesFilter(input);
  }, [input]);

  function filter(setFilter) {
    return (input) => {
      setShouldFilter(!!input?.length);
      setFilter(input);
    };
  }

  return (
    <Box>
      <form noValidate autoComplete="off">
        {isFunction(renderInput) && renderInput({ input, handleInputChange })}
      </form>
      {isFunction(children) &&
        children({
          countries: countries.filtered,
          cities: cities.filtered,
          currentCountry: cities.currentCountry,
          goToCountryView,
          goToCityView,
          shouldDisplay,
        })}
    </Box>
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
