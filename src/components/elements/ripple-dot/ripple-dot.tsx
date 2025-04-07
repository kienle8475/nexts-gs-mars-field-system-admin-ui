/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { colord } from "colord";
import { nanoid, resolveCssVariable } from "@/utils/common";

interface AProps {
  size?: number;
  ratio?: number;
  color?: string;
  speed?: number;
}

const A = (props: AProps) => {
  const { size = 10, ratio = 5, color = "var(--color-primary-base)", speed = 1 } = props;

  const instanceId = React.useMemo(() => nanoid("alpha"), [size, ratio, color, speed]);
  const fxRippleId = React.useMemo(() => `fx-ripple-${instanceId}`, [instanceId]);

  return (
    <div
      css={css`
        @keyframes ${fxRippleId} {
          0% {
            left: ${size / 2}px;
            top: ${size / 2}px;
            opcity: 0.75;
            width: 0;
            height: 0;
          }
          100% {
            left: -${(size * ratio) / 2 - size / 2}px;
            top: -${(size * ratio) / 2 - size / 2}px;
            opacity: 0;
            width: ${size * ratio}px;
            height: ${size * ratio}px;
          }
        }

        position: relative;
        width: ${size}px;
        height: ${size}px;

        &::before {
          content: " ";
          position: absolute;
          z-index: 2;
          left: 0;
          top: 0;
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
        }

        &::after {
          content: " ";
          position: absolute;
          z-index: 1;
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          box-shadow: 0 0 ${size}px rgba(255, 255, 255, 0.3) inset;
          animation: ${fxRippleId} ${speed}s infinite ease normal;
        }
      `}
    />
  );
};

interface BProps {
  size?: number;
  ratio?: number;
  color?: string;
  speed?: number;
}

const B = (props: BProps) => {
  const { size = 10, ratio = 2, color = "var(--color-primary-base)", speed = 1 } = props;

  const instanceId = React.useMemo(() => nanoid("alpha"), [size, ratio, color, speed]);
  const fxRippleId = React.useMemo(() => `fx-ripple-${instanceId}`, [instanceId]);

  const shadowColorStart = React.useMemo(() => {
    try {
      if (color.startsWith("var(")) {
        const resolvedColor = resolveCssVariable(color);
        if (resolvedColor) {
          const parsedColor = colord(resolvedColor);
          if (parsedColor.isValid()) {
            return parsedColor.alpha(0.5).toRgbString();
          } else {
            throw Error("Invalid color.");
          }
        } else {
          throw Error("Invalid color variable.");
        }
      }

      const parsedColor = colord(color);

      if (parsedColor.isValid()) {
        return parsedColor.alpha(0.5).toRgbString();
      } else {
        throw Error("Invalid color.");
      }
    } catch (e) {
      return `#60778180`;
    }
  }, [color]);

  return (
    <div
      css={css`
        @keyframes ${fxRippleId} {
          0% {
            box-shadow: 0 0 0 0.1rem ${shadowColorStart};
          }
          100% {
            box-shadow: 0 0 0 ${size * ratio}px rgba(255, 255, 255, 0);
          }
        }

        position: relative;
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        animation: ${fxRippleId} ${speed}s linear infinite;

        &::after {
          animation: ${fxRippleId} ${speed}s linear infinite ${speed * 0.65}s;
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          animation: ${fxRippleId} ${speed}s linear infinite ${speed * 0.35}s;
        }
      `}
    />
  );
};

interface CProps {
  size?: number;
  ratio?: number;
  color?: string;
  speed?: number;
}

const C = (props: CProps) => {
  const { size = 10, ratio = 3, color = "var(--color-primary-base)", speed = 2 } = props;

  const instanceId = React.useMemo(() => nanoid("alpha"), [size, ratio, color, speed]);
  const fxRippleId = React.useMemo(() => `fx-ripple-${instanceId}`, [instanceId]);

  return (
    <div
      css={css`
        @keyframes ${fxRippleId} {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 0;
            transform: scale(${ratio});
          }
          100% {
            opacity: 0;
            transform: scale(${ratio});
          }
        }

        display: inline-block;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        position: relative;
        z-index: 2;
        background-color: ${color};

        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: inherit;
          border-radius: 50%;
          z-index: 1;
          animation: ${fxRippleId} ${speed}s ease-out infinite;
        }
      `}
    />
  );
};

export { A, B, C };
