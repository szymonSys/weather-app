import { useContext, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function SelectCountry() {
  const { countries, cities } = useContext(storeContext);
  const setCountry = useCallback(
    (e) => cities.fetchCitiesForCountry(e.target.value, true),
    [cities]
  );

  return (
    <select onChange={setCountry} defaultValue={cities.currentCountry}>
      {countries.sorted.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}

export default observer(SelectCountry);
