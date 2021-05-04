import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { isFunction } from "../../utils";
import useIcons from "../../hooks/useIcons";
import { CircularProgress, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 160,
    padding: "16px 42px 52px",
    margin: "60px 0",
  },
});

function LocalizationWeather({ children }) {
  const { cityWeather } = useContext(storeContext);

  const classes = useStyles();

  const {
    weather: { ic: iconCode, tp: temperature },
  } = cityWeather?.weatherData?.current || { weather: {} };

  const icons = useIcons(iconCode, temperature);

  return (
    <>
      {isFunction(children) && (
        <Paper className={classes.wrapper}>
          {cityWeather.isLoaded ? (
            children({ ...cityWeather, icons })
          ) : (
            <CircularProgress />
          )}
        </Paper>
      )}
    </>
  );
}

export default observer(LocalizationWeather);
