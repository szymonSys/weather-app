import { useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storeContext } from "../../models";
import { CircularProgress, makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "16px 0",
  },
});

function GoToCurrentCountry() {
  const classes = useStyles();

  const {
    cities: { currentCountry, isLoaded },
    localization: { region },
  } = useContext(storeContext) || { cities: {} };
  const country = currentCountry ?? region;
  return (
    <Box className={classes.wrapper}>
      {isLoaded ? (
        <Link
          to={{ pathname: `country/${country}`, state: { toTopInMount: true } }}
        >
          All cities for {country}
        </Link>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}

export default observer(GoToCurrentCountry);
