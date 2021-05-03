import { useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function GoToCurrentCountry() {
  const {
    cities: { currentCountry, isLoaded },
    localization: { region },
  } = useContext(storeContext) || { cities: {} };
  const country = currentCountry ?? region;
  return (
    <>
      {isLoaded ? (
        <Link
          to={{ pathname: `country/${country}`, state: { toTopInMount: true } }}
        >
          All cities for {country}
        </Link>
      ) : (
        <span>loading cities...</span>
      )}
    </>
  );
}

export default observer(GoToCurrentCountry);
