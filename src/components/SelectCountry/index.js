import { useContext, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import {
  FormControl,
  makeStyles,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles({
  formControl: {
    width: 640,
    maxWidth: "90vw",
  },
  wrapper: {
    margin: "16px 0",
  },
});

function SelectCountry() {
  const { countries, cities, localization } = useContext(storeContext);
  const setCountry = useCallback(
    (e) => cities.fetchCitiesForCountry(e.target.value, true),
    [cities]
  );

  const classes = useStyles();

  const currentCountry = cities.currentCountry ?? localization.country;

  return (
    <Box className={classes.wrapper}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={setCountry}
          value={currentCountry}
        >
          {countries.sorted.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default observer(SelectCountry);
