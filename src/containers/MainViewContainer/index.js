import { useCallback, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Search from "../../components/Search";
import SelectCountry from "../../components/SelectCountry";

export default function MainContainerView({ children }) {
  const renderInput = useCallback(
    ({ input, handleInputChange }) => (
      <TextField
        value={input}
        onChange={handleInputChange}
        id="outlined-basic"
        label="search"
        placeholder="City or country..."
        variant="outlined"
      />
    ),
    []
  );

  const renderCountries = useCallback(
    (countries, goToCountryView) => (
      <div>
        <h3>Countries</h3>
        <ul>
          {countries?.map((country) => (
            <li key={country} onClick={goToCountryView(country)}>
              {country}
            </li>
          ))}
        </ul>
      </div>
    ),
    []
  );

  const renderCities = useCallback(
    (cities, goToCityView) => (
      <div>
        <h3>Cities</h3>
        <ul>
          {cities?.map(({ city, state, country, id }) => (
            <li key={id} onClick={goToCityView({ city, state, country, id })}>
              {city} {state} {country}
            </li>
          ))}
        </ul>
      </div>
    ),
    []
  );

  const renderContent = ({
    countries,
    cities,
    goToCityView,
    goToCountryView,
    shouldDisplay,
  }) => (
    <>
      {shouldDisplay && (
        <div>
          {renderCities(cities, goToCityView)}
          {renderCountries(countries, goToCountryView)}
        </div>
      )}
    </>
  );

  return (
    <div>
      <h2>Weather search</h2>
      <Search renderInput={renderInput}>{renderContent}</Search>
      <SelectCountry />
      {children}
    </div>
  );
}
