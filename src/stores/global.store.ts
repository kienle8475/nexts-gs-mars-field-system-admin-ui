import { createStore } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type GlobalStore = {
  actions: {};
};

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    devtools(
      persist(
        (set) => ({
          actions: {},
        }),
        {
          name: "global-storage",
          partialize: (state) => ({}),
          onRehydrateStorage: (state) => {
            if (state) {
            }
          },
        },
      ),
      { name: "GlobalStore" },
    ),
  );
};
