import SockJS from "sockjs-client";
import { Client, StompSubscription, IFrame } from "@stomp/stompjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { notification } from "antd";

interface WSContextType {
  client: Client | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (destination: string, callback: (message: any) => void) => void;
  unsubscribe: (subscriptionId: string) => void;
  send: (destination: string, body: any) => void;
}

export const WSContext = React.createContext<WSContextType | undefined>(undefined);

interface WSProviderProps {
  children: React.ReactNode;
}

export const WSProvider = (props: WSProviderProps) => {
  const { children } = props;

  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

  const connect = () => {
    if (clientRef.current?.connected) return;

    const socket = new SockJS(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str: string) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
      setConnected(true);
      notification.success({
        message: "WebSocket Connected",
        description: "Successfully connected to WebSocket server",
        placement: "topRight",
      });
    };

    stompClient.onStompError = (frame: IFrame) => {
      console.error("STOMP error", frame);
      setConnected(false);
      notification.error({
        message: "WebSocket Error",
        description: "STOMP protocol error occurred",
        placement: "topRight",
      });
    };

    stompClient.onWebSocketError = (event: Event) => {
      console.error("WebSocket error", event);
      setConnected(false);
      notification.error({
        message: "WebSocket Error",
        description: "Connection error occurred",
        placement: "topRight",
      });
    };

    stompClient.onWebSocketClose = () => {
      console.log("WebSocket connection closed");
      setConnected(false);
      notification.warning({
        message: "WebSocket Disconnected",
        description: "Connection to WebSocket server was closed",
        placement: "topRight",
      });
    };

    stompClient.activate();
    clientRef.current = stompClient;
  };

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      setConnected(false);
      subscriptionsRef.current.clear();
      notification.info({
        message: "WebSocket Disconnected",
        description: "Manually disconnected from WebSocket server",
        placement: "topRight",
      });
    }
  };

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (!clientRef.current?.connected) {
      console.warn("WebSocket not connected");
      notification.warning({
        message: "Subscription Failed",
        description: "Cannot subscribe: WebSocket is not connected",
        placement: "topRight",
      });
      return;
    }

    const subscription = clientRef.current.subscribe(destination, (message: { body: string }) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error("Error parsing message:", error);
        callback(message.body);
      }
    });

    subscriptionsRef.current.set(destination, subscription);
  };

  const unsubscribe = (destination: string) => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
  };

  const send = (destination: string, body: any) => {
    if (!clientRef.current?.connected) {
      console.warn("WebSocket not connected");
      notification.warning({
        message: "Send Failed",
        description: "Cannot send message: WebSocket is not connected",
        placement: "topRight",
      });
      return;
    }

    const messageBody = typeof body === "string" ? body : JSON.stringify(body);
    clientRef.current.publish({
      destination,
      body: messageBody,
    });
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const value = {
    client: clientRef.current,
    connected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
  };

  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WSProvider");
  }
  return context;
};
