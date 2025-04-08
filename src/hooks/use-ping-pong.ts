import { useWebSocket } from "@/contexts/ws.context";
import { notification } from "antd";
import { useEffect, useCallback } from "react";

export const usePingPong = () => {
  const { subscribe, send, connected } = useWebSocket();

  const handlePing = useCallback((message: any) => {
    // notification.info({
    //   message: "Server Ping",
    //   description: message.message,
    //   placement: "topRight",
    // });
  }, []);

  const handlePong = useCallback((message: any) => {
    // notification.success({
    //   message: "Server Pong",
    //   description: message.message,
    //   placement: "topRight",
    // });
  }, []);

  useEffect(() => {
    if (connected) {
      // Subscribe to ping messages
      subscribe("/topic/ping", handlePing);
      // Subscribe to pong messages
      subscribe("/topic/pong", handlePong);

      return () => {
        // Cleanup subscriptions when component unmounts
        // The WebSocket context will handle unsubscribing
      };
    }
  }, [connected, subscribe, handlePing, handlePong]);

  const sendPing = useCallback(() => {
    if (connected) {
      send("/app/ping", {
        type: "ping",
        timestamp: new Date().toISOString(),
        message: "Client ping",
      });
    }
  }, [connected, send]);

  return {
    sendPing,
  };
};
