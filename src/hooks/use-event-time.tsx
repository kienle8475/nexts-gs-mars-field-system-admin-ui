import moment from "moment";
import React, { useMemo, useEffect } from "react";

export const useEventTime = (props: { startTime: Date; endTime: Date }) => {
  const { startTime, endTime } = props;
  const [now, setNow] = React.useState(moment());

  const hasStarted = useMemo(() => {
    return now.isAfter(moment(startTime));
  }, [now, startTime]);

  const hasEnded = useMemo(() => {
    return now.isAfter(moment(endTime));
  }, [now, endTime]);

  const timeUntilStart = useMemo(() => {
    if (!hasStarted) {
      const duration = moment.duration(moment(startTime).diff(now));
      return {
        minutes: duration.minutes(),
        hours: duration.hours(),
        asMinutes: duration.asMinutes(),
      };
    }
    return null;
  }, [hasStarted, now, startTime]);

  const timeSinceStart = useMemo(() => {
    if (hasStarted && !hasEnded) {
      const duration = moment.duration(now.diff(moment(startTime)));
      return {
        minutes: duration.minutes(),
        hours: duration.hours(),
        asMinutes: duration.asMinutes(),
      };
    }
    return null;
  }, [hasStarted, hasEnded, now, startTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    timeUntilStart,
    timeSinceStart,
    hasStarted,
    hasEnded,
  };
};
