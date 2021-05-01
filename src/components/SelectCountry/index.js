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
    <select onChange={setCountry}>
      {countries.sorted.map((country, index) => (
        <option
          key={index}
          selected={cities.currentCountry === country}
          value={country}
        >
          {country}
        </option>
      ))}
    </select>
  );
}

export default observer(SelectCountry);
