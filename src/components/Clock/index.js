import { useState, useEffect, useCallback } from "react";
import { matchPrefix } from "../../utils";

export default function Clock() {
  const [time, setTime] = useState({});

  useEffect(() => {
    handleTick();
    setInterval(handleTick, 1000);
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
    <div>
      <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );
}
