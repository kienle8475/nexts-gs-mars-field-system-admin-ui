/** @jsxImportSource @emotion/react */
import React, { useRef } from "react";
import { css } from "@emotion/react";
import { nanoid, resolveCssVariable } from "@/utils/common";
import { colord } from "colord";

export const useRipple = (props?: { duration?: number; color?: string; center?: boolean }) => {
  const { duration = 600, color = "rgba(255,255,255,0.5)", center = false } = props || {};

  const rippleContainerId = React.useMemo(() => nanoid("alpha"), []);
  const rippleContainerRef = useRef<HTMLDivElement>(null);

  const rippleColor = (() => {
    try {
      if (color.startsWith("var(")) {
        const resolvedColor = resolveCssVariable(color);
        if (resolvedColor) {
          const parsedColor = colord(resolvedColor);
          if (parsedColor.isValid()) {
            return parsedColor.toRgbString();
          } else {
            throw Error("Invalid color.");
          }
        } else {
          throw Error("Invalid color variable.");
        }
      }

      const parsedColor = colord(color);

      if (parsedColor.isValid()) {
        return parsedColor.toRgbString();
      } else {
        throw Error("Invalid color.");
      }
    } catch (e) {
      return `#FFFFFF80`;
    }
  })();

  const createRipple = (
    event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>,
  ) => {
    const button = event.currentTarget as HTMLButtonElement;
    const { width, height } = button.getBoundingClientRect();
    const diameter = Math.max(width, height);
    const radius = diameter / 2;

    const rippleElement = document.createElement("span");
    rippleElement.style.width = `${diameter}px`;
    rippleElement.style.height = `${diameter}px`;
    rippleElement.style.position = "absolute";
    rippleElement.style.transform = "scale(0.3)";
    rippleElement.style.pointerEvents = "none";
    rippleElement.style.zIndex = "1";
    rippleElement.style.borderRadius = "50%";
    rippleElement.style.opacity = "0";
    rippleElement.style.backgroundColor = rippleColor;
    rippleElement.style.animation = `fx-ripper ${duration}ms linear`;

    if (center) {
      rippleElement.style.left = `${width / 2 - radius}px`;
      rippleElement.style.top = `${height / 2 - radius}px`;
    } else {
      const { left, top } = button.getBoundingClientRect();
      const offsetX = event.clientX - left;
      const offsetY = event.clientY - top;
      rippleElement.style.left = `${offsetX - radius}px`;
      rippleElement.style.top = `${offsetY - radius}px`;
    }

    if (rippleContainerRef.current) {
      rippleContainerRef.current.appendChild(rippleElement);
    }

    setTimeout(() => {
      rippleElement.remove();
    }, duration);
  };

  const rippleContainer = (
    <div
      id={rippleContainerId}
      ref={rippleContainerRef}
      className="absolute inset-0 z-[1] overflow-hidden"
      css={css`
        @keyframes fx-ripper {
          from {
            opacity: 1;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}
    />
  );

  React.useEffect(() => {
    if (rippleContainerRef.current) {
      const parentElement = rippleContainerRef.current?.parentNode as HTMLElement;
      if (parentElement) {
        parentElement.style.position = "relative";
        parentElement.style.overflow = "hidden";
      }
    }
  }, []);

  return {
    createRipple,
    rippleContainer,
  };
};
