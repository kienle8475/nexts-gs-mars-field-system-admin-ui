import { css } from "@emotion/react";

export const useRippleOutlineStyle = (props?: { duration?: number; color?: string }) => {
  const { duration = 0.3, color = "var(--color-primary-base)" } = props || {};

  return css`
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 0 0 0 5px ${color};
      opacity: 0;
      transition: ${duration}s;
    }

    &:active::after {
      transition: 0s;
      box-shadow: none;
      opacity: 0.6;
    }
  `;
};
