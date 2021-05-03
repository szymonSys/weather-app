import { useContext, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function SelectCountry() {
  const { countries, cities, localization } = useContext(storeContext);
  const setCountry = useCallback(
    (e) => cities.fetchCitiesForCountry(e.target.value, true),
    [cities]
  );

  const currentCountry = cities.currentCountry ?? localization.country;

  return (
    <select onChange={setCountry} value={currentCountry}>
      {countries.sorted.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}

export default observer(SelectCountry);
