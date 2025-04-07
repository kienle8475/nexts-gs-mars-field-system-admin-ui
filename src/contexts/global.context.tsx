"use client";
import { createGlobalStore, GlobalStore } from "@/stores/global.store";
import { createSelectors } from "@/utils/common";
import React from "react";
import { StoreApi } from "zustand";
import { useAuthContext } from "./auth.context";
import { useRouter } from "nextjs-toploader/app";

export interface IGlobalContext extends StoreApi<GlobalStore> {}
const GlobalContext = React.createContext<IGlobalContext | undefined>(undefined);

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

export const GlobalContextProvider = (props: GlobalContextProviderProps) => {
  const { children } = props;

  const storeRef = React.useRef<IGlobalContext>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  const storeSelectors = createSelectors(storeRef.current);

  const authContext = useAuthContext();
  const authenticated = authContext.use.authenticated();
  const token = authContext.use.token();

  const router = useRouter();

  return <GlobalContext.Provider value={storeRef.current}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => {
  const context = React.useContext(GlobalContext);

  if (!context) {
    throw new Error("GlobalContext must be used within a GlobalContextProvider");
  }

  return createSelectors(context);
};
