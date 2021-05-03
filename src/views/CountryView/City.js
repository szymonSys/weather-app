import useIcons from "../../hooks/useIcons";

export default function City({ setRef, isLast, onClick, data }) {
  const {
    city,
    state,
    country,
    current: { weather, pollution },
  } = data || { current: {} };

  const icons = useIcons(weather?.ic, weather?.tp);

  return (
    <li ref={setRef(isLast)} onClick={onClick} style={{ padding: "100px 0" }}>
      <img alt="" src={icons?.weather} width={72} />
      <span>{weather?.tp} C </span>
      <span>
        {city} {country} {state}
      </span>
      {/* <img alt="" src={icons?.temperature} width={48} /> */}
      <img alt="" src={icons?.pollution} width={48} />
      <span>{pollution?.aqius} AQI </span>
    </li>
  );
}
