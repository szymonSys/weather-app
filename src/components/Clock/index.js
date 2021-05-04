import { useState, useEffect, useCallback, useRef } from "react";
import { Typography } from "@material-ui/core";
import { matchPrefix } from "../../utils";

export default function Clock() {
  const [time, setTime] = useState({});
  const intervalIdRef = useRef();

  useEffect(() => {
    handleTick();
    intervalIdRef.current = setInterval(handleTick, 1000);
    return () => clearInterval(intervalIdRef.current);
  }, []);

  const matchZeroPrefix = useCallback(
    matchPrefix(0)((value) => Number(value) < 10),
    []
  );

  function handleTick() {
    const now = new Date();
    const currentTime = {
      hours: matchZeroPrefix(now.getHours()),
      minutes: matchZeroPrefix(now.getMinutes()),
      seconds: matchZeroPrefix(now.getSeconds()),
    };
    setTime(currentTime);
  }

  const { hours, minutes, seconds } = time;

  return (
    <Typography variant="h5">
      <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </Typography>
  );
}
