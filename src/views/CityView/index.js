import React, { useContext, useEffect, useState, useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { storeContext } from "../../models";
import { getSearchParams } from "../../utils";
import useIcons from "../../hooks/useIcons";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [17, 46],
});

L.Marker.prototype.options.icon = DefaultIcon;

function CityView() {
  const [didMount, setDidMount] = useState(false);
  const { cities } = useContext(storeContext);

  const {
    city,
    country,
    state,
    location: { coordinates },
    current: { weather, pollution },
  } = cities.currentCity || { current: {}, location: {} };

  const icons = useIcons(weather?.ic, weather?.tp);

  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const { cityId } = useMemo(() => getSearchParams(location?.search), [
    location?.search,
  ]);

  const isLoaded = useMemo(() => didMount && cities.isLoaded, [
    didMount,
    cities.isLoaded,
  ]);

  useEffect(() => {
    loadData(cityId, params.country, cities.currentCountry);
  }, [cityId, params.country, cities.currentCountry]);

  useEffect(() => {
    setDidMount(true);
  }, []);

  async function loadData(cityId, country, currentCountry) {
    country !== currentCountry &&
      (await Promise.resolve(cities.fetchCitiesForCountry(country, true)));
    cities.loadCityWeather(Number(cityId));
  }

  const [lat, lon] = Array.isArray(coordinates) ? coordinates : [];

  return (
    <>
      {!isLoaded ? (
        <div>loading city...</div>
      ) : (
        <div>
          <button onClick={() => history.goBack()}>back</button>
          <div>
            <h2>
              {city}{" "}
              <span>
                {state} {country}
              </span>
            </h2>
            <img alt="weather icon" src={icons?.weather} width={120} />
          </div>
          <div>
            <div>
              <img alt="temperature icon" src={icons?.temperature} width={32} />
              <span>{weather?.tp} C</span>
            </div>
            <div>
              <img alt="air pollution icon" src={icons?.pollution} width={32} />
              <span>{pollution?.aqius} AQI</span>
            </div>
            <div>
              <img alt="humidity icon" src={icons?.humidity} width={32} />
              <span>{weather?.hu} %</span>
            </div>
            <div>
              <img alt="air pressure icon" src={icons?.pressure} width={32} />
              <span>{weather?.pr} hPa</span>
            </div>
            <div>
              <img alt="wind speed icon" src={icons?.wind} width={32} />
              <span>{weather?.ws} m/s</span>
            </div>
            <div>
              <img
                alt="wind direction icon"
                src={icons?.direciton}
                width={32}
              />
              <span>{weather?.wd} </span>
            </div>
          </div>
          {coordinates && (
            <div>
              <MapContainer
                style={{ height: 400, width: 400 }}
                center={[lon, lat]}
                zoom={6}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lon, lat]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default observer(CityView);
