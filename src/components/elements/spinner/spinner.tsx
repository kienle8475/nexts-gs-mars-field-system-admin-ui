/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { cn, nanoid } from "@/utils/common";

interface AProps {
  size?: number;
  ballSize?: number;
  color?: string;
  speed?: number;
}

const A = (props: AProps) => {
  const { size = 64, ballSize = 12, color = "var(--color-primary-base)", speed = 2 } = props;

  const instanceId = React.useMemo(() => nanoid("alpha"), []);
  const fxRotateId = React.useMemo(() => `fx-rotate-${instanceId}`, []);

  return (
    <div
      css={css`
        @keyframes ${fxRotateId} {
          0% {
            transform: rotate(0deg) scale(1);
          }
          100% {
            transform: rotate(1440deg) scale(1);
          }
        }

        position: absolute;
        height: ${size}px;
        width: ${size}px;
        top: 50%;
        left: 50%;
        margin: auto;
        z-index: 1;
        transform: translate(-50%, -50%);

        & > span {
          position: absolute;
          display: block;
          background-color: ${color};
          left: ${size - ballSize / 2}px;
          width: ${ballSize}px;
          height: ${ballSize}px;
          border-radius: 50%;
        }

        & > span:nth-child(1) {
          animation: ${fxRotateId} ${speed}s infinite cubic-bezier(0.5, 0.3, 0.9, 0.9);
          transform-origin: ${-(size / 2) + ballSize / 2}px ${size / 2}px;
        }

        & > span:nth-child(2) {
          animation: ${fxRotateId} ${speed}s infinite cubic-bezier(0.5, 0.5, 0.9, 0.9);
          transform-origin: ${-(size / 2) + ballSize / 2}px ${size / 2}px;
        }

        & > span:nth-child(3) {
          animation: ${fxRotateId} ${speed}s infinite cubic-bezier(0.5, 0.7, 0.9, 0.9);
          transform-origin: ${-(size / 2) + ballSize / 2}px ${size / 2}px;
        }
      `}
    >
      {Array.from({ length: 3 }, (_, k) => (
        <span key={k} />
      ))}
    </div>
  );
};

interface BProps {
  size?: number;
  color?: string;
  stroke?: number;
  speed?: number;
}

const B = (props: BProps) => {
  const { size = 20, color = "var(--color-primary-base)", stroke = 2, speed = 0.5 } = props;

  const instanceId = React.useMemo(() => nanoid("alpha"), []);
  const fxRotateId = React.useMemo(() => `fx-rotate-${instanceId}`, []);

  return (
    <div
      className="cursor-default select-none"
      css={css`
        width: ${size}px;
        height: ${size}px;
      `}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute left-1/2 top-1/2">
          <div
            className={cn(
              "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10",
            )}
            css={css`
              width: ${size}px;
              height: ${size}px;
              box-shadow: inset 0 0 0 ${stroke}px ${color};
            `}
          />
          <div
            className="absolute left-1/2 top-1/2"
            css={css`
              @keyframes ${fxRotateId} {
                100% {
                  transform: rotate(360deg);
                }
              }

              width: ${size / 2}px;
              height: ${size}px;
              margin-top: ${-size / 2}px;
              margin-left: ${-size / 2}px;
              mask-image: linear-gradient(rgba(0, 0, 0, 1), transparent);
              transform-origin: ${size / 2}px ${size / 2}px;
              animation: ${fxRotateId} ${speed}s infinite linear;
            `}
          >
            <div
              className={cn("absolute left-0 top-0 rounded-full opacity-80")}
              css={css`
                width: ${size}px;
                height: ${size}px;
                box-shadow: inset 0 0 0 ${stroke}px ${color};
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { A, B };
