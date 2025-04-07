import moment from "moment";
import React from "react";

export const useEventStatus = (props: {
  startTime: Date;
  endTime: Date;
  threshold: {
    upcoming: number; // minutes before startTime considered as upcoming
    startingSoon: number; // minutes before startTime considered as starting soon
  };
}) => {
  const { startTime, endTime, threshold } = props;
  const [now, setNow] = React.useState(moment());

  // Base Status
  const notYetStarted = React.useMemo(() => {
    return now.isBefore(moment(startTime));
  }, [now, startTime]);

  const hasStarted = React.useMemo(() => {
    return now.isAfter(moment(startTime)) && now.isBefore(moment(endTime));
  }, [now, startTime, endTime]);

  const hasEnded = React.useMemo(() => {
    return now.isAfter(moment(endTime));
  }, [now, endTime]);

  // Proximity Status
  const isUpcoming = React.useMemo(() => {
    const diffInMinutes = moment(startTime).diff(now, "minutes");
    return diffInMinutes <= threshold.upcoming && diffInMinutes > threshold.startingSoon;
  }, [now, startTime, threshold.upcoming, threshold.startingSoon]);

  const isStartingSoon = React.useMemo(() => {
    const diffInMinutes = moment(startTime).diff(now, "minutes");
    return diffInMinutes <= threshold.startingSoon && diffInMinutes > 0;
  }, [now, startTime, threshold.startingSoon]);

  const isOngoing = React.useMemo(() => {
    return hasStarted;
  }, [hasStarted]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    notYetStarted,
    hasStarted,
    hasEnded,
    isUpcoming,
    isStartingSoon,
    isOngoing,
  };
};
