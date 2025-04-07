import { usePingPong } from "./use-ping-pong";
import { useEffect, useRef } from "react";

export const useAutoPingPong = (interval: number = 30000) => {
  const { sendPing } = usePingPong();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start sending pings automatically
    intervalRef.current = setInterval(() => {
      sendPing();
    }, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, sendPing]);

  return {
    sendPing,
  };
};
