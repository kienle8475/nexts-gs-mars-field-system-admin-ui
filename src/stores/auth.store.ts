import { IUser } from "@/types/model";
import { createStore } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type AuthStore = {
  token: string | null | undefined;
  authenticated: boolean | undefined;
  user: IUser | null | undefined;
  getAll: () => AuthStore;
};

export const createAuthStore = () => {
  return createStore<AuthStore>()(
    devtools(
      persist(
        (set, get) => ({
          token: undefined,
          authenticated: undefined,
          user: undefined,
          getAll: () => get(),
        }),
        {
          name: "auth-storage",
          partialize: (state) => ({
            authenticated: state.authenticated,
            token: state.token,
            user: state.user,
          }),
        },
      ),
      { name: "AuthStore" },
    ),
  );
};
