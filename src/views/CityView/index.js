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
import Clock from "../../components/Clock";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  makeStyles,
  IconButton,
} from "@material-ui/core";

import { ArrowBackSharp } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    margin: "24px 0",
    padding: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  wrapper: {
    width: "100%",
  },
  weatherWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  weatherIcon: {
    height: 180,
    display: "block",
    paddingRight: 32,
  },
  data: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "24px 0",
  },
  back: {
    position: "fixed",
    zIndex: 2,
    left: 60,
    top: 60,
  },
  icon: {
    paddingRight: 12,
    display: "block",
    height: 48,
  },
  temperatureIcon: {
    display: "block",
    height: 80,
  },
  temperature: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  map: { height: 360, width: 580 },
  mapContainer: {
    margin: "48px 0",
  },
  secondWrapper: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  temp: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [17, 46],
});

L.Marker.prototype.options.icon = DefaultIcon;

function CityView() {
  const [didMount, setDidMount] = useState(false);
  const { cities } = useContext(storeContext);
  const classes = useStyles();

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
      <IconButton
        color="primary"
        className={classes.back}
        onClick={() => history.goBack()}
      >
        <ArrowBackSharp fontSize="large" />
      </IconButton>
      <Card className={classes.container}>
        {!isLoaded ? (
          <CircularProgress />
        ) : (
          <Box className={classes.wrapper}>
            <Box className={classes.weatherWrapper}>
              <img
                className={classes.weatherIcon}
                alt="weather icon"
                src={icons?.weather}
              />
              <Box>
                <Typography align="center" paragraph variant="h2">
                  {city}
                </Typography>
                <Typography
                  align="center"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  {state}
                </Typography>
                <Typography align="center" variant="subtitle2">
                  {country}
                </Typography>
              </Box>
              <Box className={classes.temp}>
                <Box className={classes.temperature}>
                  <img
                    className={classes.temperatureIcon}
                    alt="temperature icon"
                    src={icons?.temperature}
                  />
                  <Typography color="primary" variant="h2">
                    {weather?.tp} &deg;C
                  </Typography>
                </Box>
                <Clock />
              </Box>
            </Box>
            <Box className={classes.secondWrapper}>
              {coordinates && (
                <Box className={classes.mapContainer}>
                  <MapContainer
                    className={classes.map}
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
                </Box>
              )}
              <Box>
                <Box className={classes.data}>
                  <img
                    className={classes.icon}
                    alt="air pollution icon"
                    src={icons?.pollution}
                  />
                  <Typography variant="h5" color="textSecondary">
                    {pollution?.aqius} AQI
                  </Typography>
                </Box>
                <Box className={classes.data}>
                  <img
                    className={classes.icon}
                    alt="humidity icon"
                    src={icons?.humidity}
                  />
                  <Typography variant="h5" color="textSecondary">
                    {weather?.hu} %
                  </Typography>
                </Box>
                <Box className={classes.data}>
                  <img
                    className={classes.icon}
                    alt="air pressure icon"
                    src={icons?.pressure}
                  />
                  <Typography variant="h5" color="textSecondary">
                    {weather?.pr} hPa
                  </Typography>
                </Box>
                <Box className={classes.data}>
                  <img
                    className={classes.icon}
                    alt="wind speed icon"
                    src={icons?.wind}
                  />
                  <Typography variant="h5" color="textSecondary">
                    {weather?.ws} m/s
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    </>
  );
}

export default observer(CityView);
