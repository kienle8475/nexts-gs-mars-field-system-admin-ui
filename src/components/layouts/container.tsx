/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import React from "react";
import { Header } from "./header";
import { Navbar } from "./navbar";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => {
  const { children } = props;

  const contentContainerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="mx-auto min-w-[340px]">
      <Header />
      <div
        className="grid h-screen"
        style={{ gridTemplateColumns: "250px 1fr", gridTemplateAreas: `"navbar content"` }}
      >
        <div
          className="mt-[60px] max-h-screen overflow-auto border-r border-r-border-low-emp bg-white"
          css={css`
            grid-area: navbar;

            &::-webkit-scrollbar {
              width: 0;
              height: 0;
            }

            &:hover {
              &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }

              &::-webkit-scrollbar-track {
                background-color: #ebeef0;
                border-radius: 4px;
              }

              &::-webkit-scrollbar-thumb {
                background-color: #d6dee1;
                border-radius: 4px;
                outline: none;
                cursor: pointer;
              }

              &::-webkit-scrollbar-thumb:hover {
                background: #adbcc2;
                cursor: pointer;
              }

              &::-webkit-scrollbar-thumb:active {
                background: #adbcc2;
                cursor: pointer;
              }
            }
          `}
        >
          <Navbar />
        </div>
        <div ref={contentContainerRef} className="mt-[60px] max-h-screen overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Container;
