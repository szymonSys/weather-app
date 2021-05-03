import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { isFunction } from "../../utils";
import useIcons from "../../hooks/useIcons";

function LocalizationWeather({ children }) {
  const { cityWeather } = useContext(storeContext);

  const {
    weather: { ic: iconCode, tp: temperature },
  } = cityWeather?.weatherData?.current || { weather: {} };

  const icons = useIcons(iconCode, temperature);

  return (
    <div>
      {isFunction(children) && (
        <>
          {cityWeather.isLoaded ? (
            children({ ...cityWeather, icons })
          ) : (
            <p>loading local weather...</p>
          )}
        </>
      )}
    </div>
  );
}

export default observer(LocalizationWeather);
