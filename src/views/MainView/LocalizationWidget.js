import { Grid, makeStyles, Typography, Box } from "@material-ui/core";
import Clock from "../../components/Clock";

const useStyles = makeStyles({
  localizationIcon: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 38,
  },
  data: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 32px 24px",
  },
  dataWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rowWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: "6px 56px",
    alignItems: "center",
    justifyContent: "center",
    wrap: "wrap",
  },
  icon: {
    height: 42,
    paddingRight: 6,
  },
  weatherIcon: {
    height: "100%",
    display: "block",
  },
  weatherIconWrapper: {
    height: 180,
  },
  wrapper: {
    position: "relative",
    minHeight: 160,
    padding: "16px 42px 52px",
    margin: "60px 0",
  },
});

export default function LocalizationWidget({ weatherData, geoData, icons }) {
  const classess = useStyles();

  return (
    <Box>
      <Typography align="center" variant="h5" paragraph>
        Your localization
      </Typography>
      <Grid container alignItems="center" justify="flex-start" spacing={2}>
        <Grid item className={classess.weatherIconWrapper}>
          <img
            className={classess.weatherIcon}
            alt="current weather icon"
            src={icons?.weather}
          />
        </Grid>
        <Grid item>
          <Typography color="primary" variant="h1">
            {weatherData?.current?.weather?.tp} &deg;C
          </Typography>
        </Grid>
        <Grid item className={classess.weatherIconWrapper}>
          <Box className={classess.rowWrapper}>
            <Box className={classess.dataWrapper}>
              <Box className={classess.data}>
                <img
                  className={classess.icon}
                  alt="humidity icon"
                  src={icons?.humidity}
                />
                <Box className={classess.dataWrapper}>
                  <Typography variant="subtitle1">Humidity</Typography>
                  <Typography variant="h5">
                    {weatherData?.current?.weather?.hu}%
                  </Typography>
                </Box>
              </Box>

              <Box className={classess.data}>
                <img
                  className={classess.icon}
                  alt="humidity icon"
                  src={icons?.pressure}
                />
                <Box className={classess.dataWrapper}>
                  <Typography variant="subtitle1">Pressure</Typography>
                  <Typography variant="h5">
                    {weatherData?.current?.weather?.pr} hPa
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className={classess.dataWrapper}>
              <Box className={classess.data}>
                <img
                  className={classess.icon}
                  alt="wind speed icon"
                  src={icons?.wind}
                />
                <Box className={classess.dataWrapper}>
                  <Typography variant="subtitle1">Wind speed</Typography>
                  <Typography variant="h5">
                    {weatherData?.current?.weather?.ws} m/s
                  </Typography>
                </Box>
              </Box>
              <Box className={classess.data}>
                <img
                  className={classess.icon}
                  alt="humidity icon"
                  src={icons?.pollution}
                />
                <Box className={classess.dataWrapper}>
                  <Typography variant="subtitle1">Pollution</Typography>
                  <Typography variant="h5">
                    {weatherData?.current?.pollution?.aqius} AQI
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item className={classess.weatherIconWrapper}>
          <Typography variant="overline">{weatherData.country}</Typography>
          <Typography color="textSecondary" variant="subtitle2">
            {weatherData.state}
          </Typography>
          <Typography color="secondary" paragraph variant="h3">
            {weatherData.city}
          </Typography>
          <Clock />
        </Grid>
      </Grid>
      <img
        className={classess.localizationIcon}
        alt="localization icon"
        src={icons?.pin}
      />
    </Box>
  );
}
