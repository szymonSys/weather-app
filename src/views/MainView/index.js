import { useCallback } from "react";
import LocalizationWeather from "../../containers/LocalizationWeather";
import Search from "../../components/Search";
import SelectCountry from "../../components/SelectCountry";
import GoToCurrentCountry from "../../components/GoToCurrentCountry";
import LocalizationWidget from "./LocalizationWidget";
import {
  Box,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles({
  search: {
    width: 640,
    maxWidth: "90vw",
    margin: "46px 0 32px",
  },
  list: {
    margin: "32px 0",
  },
  container: {
    margin: "20px 0",
  },
  wrapper: {
    position: "absolute",
    transform: "translateY(-30px)",
    overflowY: "scroll",
    width: 580,
    maxWidth: "90vw",
    height: 320,
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    padding: 32,
    zIndex: 2,
  },
  listItem: { cursor: "pointer" },
});

export default function MainView() {
  const classes = useStyles();

  const renderInput = useCallback(
    ({ input, handleInputChange }) => (
      <TextField
        className={classes.search}
        value={input}
        onChange={handleInputChange}
        id="outlined-basic"
        label="search"
        placeholder="City or country..."
        variant="outlined"
      />
    ),
    []
  );

  const renderCountries = useCallback(
    (countries, currentCountry, goToCountryView) => (
      <Box className={classes.list}>
        <Typography variant="h5">Countries</Typography>

        <List>
          {countries?.map((country) => (
            <ListItem
              className={classes.listItem}
              key={country}
              selected={currentCountry === country}
              onClick={goToCountryView(country)}
            >
              {country}
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    []
  );

  const renderCities = useCallback(
    (cities, currentCountry, goToCityView) => (
      <Box className={classes.list}>
        <Typography variant="h5">Cities for {currentCountry}</Typography>
        <List>
          {cities?.map(({ city, state, country, id }) => (
            <ListItem
              className={classes.listItem}
              key={id}
              onClick={goToCityView({ city, state, country, id })}
            >
              <Box>
                <Typography variant="caption">{state}</Typography>
                <Typography variant="h6">{city} </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    []
  );

  const renderContent = ({
    countries,
    cities,
    goToCityView,
    goToCountryView,
    shouldDisplay,
    currentCountry,
  }) => (
    <>
      {shouldDisplay && (
        <Paper className={classes.wrapper}>
          {renderCities(cities, currentCountry, goToCityView)}
          <Divider />
          {renderCountries(countries, currentCountry, goToCountryView)}
        </Paper>
      )}
    </>
  );
  return (
    <Box className={classes.container}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography variant="h5">Find weather</Typography>
        <Search renderInput={renderInput}>{renderContent}</Search>
        <SelectCountry />
        <GoToCurrentCountry />
      </Grid>
      <LocalizationWeather>
        {(props) => <LocalizationWidget {...props} />}
      </LocalizationWeather>
    </Box>
  );
}
