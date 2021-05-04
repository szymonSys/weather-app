import { useContext, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import useLazyLoad from "../../hooks/useLazyLoad";
import City from "./City";
import UpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
  Typography,
  makeStyles,
  Box,
  Fab,
  CircularProgress,
  IconButton,
} from "@material-ui/core";

import { HomeSharp } from "@material-ui/icons";

const useStyles = makeStyles({
  fab: {
    position: "fixed",
    bottom: 60,
    right: 60,
  },
  container: { margin: "24px 0" },
  wrapper: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "fixed",
    zIndex: 2,
    left: 60,
    top: 60,
  },
});

function CountryView() {
  const { cities } = useContext(storeContext);
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const shouldFetchCities = cities.currentCountry !== params.country;

  const setRef = useLazyLoad(cities.loadCitiesWeather.bind(cities), [
    cities.loaded.length,
    cities,
  ]);

  useEffect(() => {
    loadCities(shouldFetchCities, params.country);
  }, [shouldFetchCities, params.country, cities]);

  useEffect(() => {
    !!location.state?.toTopInMount && scrollToTop();
  }, [location.state]);

  const goToCityView = ({ country, state, city, id }) => () =>
    history.push(`/city/${country}/${state}/${city}?cityId=${id}`);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  async function loadCities(shouldFetchCities, country) {
    shouldFetchCities && (await cities.fetchCitiesForCountry(country, true));
    cities.loadCitiesWeather();
  }

  return (
    <Box className={classes.container}>
      <IconButton
        color="primary"
        className={classes.button}
        onClick={() => history.push("/")}
      >
        <HomeSharp fontSize="large" />
      </IconButton>
      <Typography variant="h2" align="center">
        {params?.country}
      </Typography>
      <Box className={classes.wrapper}>
        {shouldFetchCities ? (
          <CircularProgress />
        ) : (
          <Box>
            {cities.loaded.map((data, index, array) => (
              <City
                key={data?.id}
                setRef={setRef}
                isLast={index === array.length - 1}
                onClick={goToCityView({
                  city: data?.city,
                  state: data?.state,
                  country: data?.country,
                  id: data?.id,
                })}
                data={data}
              />
            ))}
          </Box>
        )}
      </Box>

      <Fab color="primary" className={classes.fab} onClick={scrollToTop}>
        <UpIcon />
      </Fab>
      {cities.isFetching && <CircularProgress />}
    </Box>
  );
}

export default observer(CountryView);
