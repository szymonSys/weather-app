import { useMemo } from "react";
import humidity from "../static/icons/humidity.svg";
import wind from "../static/icons/windy.svg";
import pollution from "../static/icons/pollution.svg";
import pin from "../static/icons/pin.svg";
import pressure from "../static/icons/pressure.svg";

export default function useIcons(weatherIconCode, temperature) {
  const icons = useMemo(
    () =>
      Object.freeze({
        weather: loadIconPath(weatherIconCode),
        temperature: loadIconPath(getTemperatureIconCode(temperature)),
        humidity,
        wind,
        pollution,
        pin,
        pressure,
      }),
    [weatherIconCode, temperature]
  );

  return icons;
}

function loadIconPath(iconName) {
  return iconName && require(`../static/icons/${iconName}.svg`).default;
}

function getTemperatureIconCode(temperature) {
  return temperature < 0 ? "cold" : temperature < 20 ? "warm" : "hot";
}
