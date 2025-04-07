import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { StoreApi, useStore } from "zustand";
import _ from "lodash";

export const twMerge = extendTailwindMerge({});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => useStore(store, (s) => s[k as keyof typeof s]);
  }

  return store;
};

export const nanoid = (type: "digest" | "alpha" | "mix" = "mix", length: number = 10) => {
  const characterSets = {
    digest: "1234567890",
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    mix: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
  };

  const alphabet = characterSets[type] || characterSets.mix;
  return customAlphabet(alphabet, length)();
};

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  if (typeof removed === "object" && removed !== null && "order" in removed) {
    const newOrder = result.map((item, index) => ({
      ...item,
      order: index,
    }));
    return newOrder;
  }

  return result;
};

export const getDraggedDom = (draggableId: string): Element | null => {
  const queryAttr = "data-rfd-drag-handle-draggable-id";
  const domQuery = `[${queryAttr}='${draggableId}']`;
  const draggedDOM = document.querySelector(domQuery);
  return draggedDOM;
};

export const getDroppedDom = (droppableId: string): Element | null => {
  const queryAttr = "data-rfd-droppable-id";
  const domQuery = `[${queryAttr}='${droppableId}']`;
  const droppedDOM = document.querySelector(domQuery);
  return droppedDOM;
};

export const resolveCssVariable = (variable: string) => {
  if (variable.startsWith("var(")) {
    const variableName = variable.slice(4, -1).trim();
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(variableName).trim();
  }
  return null;
};

export function waitForElementVisible({
  root = document,
  selector,
  interval = 200,
  timeout = 10000,
  safe = true,
  retry = () => false,
}: {
  root?: Document | HTMLElement;
  selector: string;
  interval?: number;
  timeout?: number;
  safe?: boolean;
  retry?: (response: HTMLElement | undefined) => boolean;
}): Promise<HTMLElement | undefined> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function findElement() {
      const element = root.querySelector(selector);
      if (element && !retry(element as unknown as HTMLEmbedElement)) {
        resolve(element as unknown as HTMLElement);
      } else {
        if (Date.now() - startTime > timeout) {
          if (!safe) {
            reject(
              new Error(`Timeout: Element with selector ${selector} not found within ${timeout}ms`),
            );
          } else {
            resolve(undefined);
          }
        } else {
          setTimeout(findElement, interval);
        }
      }
    }

    findElement();
  });
}

export function waitForElementsVisible({
  root = document,
  selector,
  interval = 200,
  timeout = 10000,
  shouldRejectOnTimeout = true,
  retry = () => false,
}: {
  root?: Document | HTMLElement;
  selector: string;
  interval?: number;
  timeout?: number;
  shouldRejectOnTimeout?: boolean;
  retry?: (response: NodeListOf<HTMLElement> | undefined) => boolean;
}): Promise<NodeListOf<HTMLElement> | undefined> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function findElement() {
      const elements = root.querySelectorAll(selector);
      if (
        Array.from(elements).length > 0 &&
        !retry(elements as unknown as NodeListOf<HTMLElement>)
      ) {
        resolve(elements as unknown as NodeListOf<HTMLElement>);
      } else {
        if (Date.now() - startTime > timeout) {
          if (shouldRejectOnTimeout) {
            reject(
              new Error(`Timeout: Element with selector ${selector} not found within ${timeout}ms`),
            );
          } else {
            resolve(undefined);
          }
        } else {
          setTimeout(findElement, interval);
        }
      }
    }

    findElement();
  });
}

export function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const objectToFormData = <
  T extends {
    [key: string]: any | Blob;
  },
>(
  obj: T,
) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, _index) => {
        const newKey = `${key}`;
        const _v =
          _.isString(item) || item instanceof Blob || item instanceof File
            ? item
            : JSON.stringify(item);
        formData.append(newKey, _v);
      });
    } else {
      const _v =
        _.isString(value) || value instanceof Blob || value instanceof File
          ? value
          : JSON.stringify(value);
      formData.append(key, _v);
    }
  });

  return formData;
};
