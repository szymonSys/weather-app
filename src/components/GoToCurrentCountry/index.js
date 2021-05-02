import { useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";

function GoToCurrentCountry() {
  const {
    cities: { currentCountry },
  } = useContext(storeContext) || { cities: {} };
  return (
    <Link to={`country/${currentCountry}`}>
      All cities for {currentCountry}
    </Link>
  );
}

export default observer(GoToCurrentCountry);
