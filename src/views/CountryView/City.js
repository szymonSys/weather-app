import useIcons from "../../hooks/useIcons";
import {
  Typography,
  makeStyles,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from "@material-ui/core";

const useStyles = makeStyles({
  fab: {
    position: "fixed",
    bottom: 60,
    right: 60,
  },
  data: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "18px 12px",
  },
  card: {
    padding: 24,
    margin: "32px 0",
    width: 320,
    cursor: "pointer",
  },
  icon: {
    width: "50%",
    height: 60,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  container: { margin: "24px 0" },
  wrapper: {
    minHeight: "90vh",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export default function City({ setRef, isLast, onClick, data }) {
  const {
    city,
    state,
    current: { weather, pollution },
  } = data || { current: {} };

  const classes = useStyles();

  const icons = useIcons(weather?.ic, weather?.tp);

  return (
    <Card className={classes.card} ref={setRef(isLast)} onClick={onClick}>
      <Typography color="textSecondary" align="center" variant="subtitle2">
        {state}
      </Typography>
      <Typography align="center" paragraph variant="h4">
        {city}
      </Typography>
      <Box className={classes.data}>
        <CardMedia className={classes.icon} image={icons?.weather} />
        <Typography color="textSecondary" variant="h4">
          {weather?.tp} &deg;C{" "}
        </Typography>
      </Box>
      <Box className={classes.data}>
        <CardMedia className={classes.icon} image={icons?.pollution} />
        <Typography color="textSecondary" variant="h4">
          {pollution?.aqius} AQI{" "}
        </Typography>
      </Box>
    </Card>
  );
}
