/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import React from "react";
import { motion } from "framer-motion";

export const Decorator = () => {
  return (
    <>
      <div className="fixed inset-0 z-[1] mx-auto h-screen w-screen max-w-[1440px] overflow-hidden bg-[#003588]">
        <div
          className="absolute bottom-0 right-0 aspect-square h-[100%] w-auto translate-x-[20%] translate-y-[20%]"
          css={css`
            opacity: 1;
            background-image: radial-gradient(#017dbc, #003588 60%);
            filter: blur(64px);
          `}
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0, duration: 0.6, ease: "easeInOut" } }}
          className="absolute bottom-0 right-0 z-[20] h-auto w-[100%] md:w-[50%]"
        >
          <img
            alt="decor-bg"
            src="/images/decor-bg.webp"
            className="h-auto w-full object-contain object-center"
          />
        </motion.div>

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.1, duration: 0.8, ease: "easeInOut" },
          }}
          className="absolute bottom-0 right-0 z-[50] h-auto w-full md:w-[50%]"
        >
          <img
            alt="decor-products"
            src="/images/decor-products.webp"
            className="relative z-[5] h-auto w-full object-contain object-center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1, duration: 0.8, ease: "easeInOut" } }}
          className="floating absolute left-0 top-[20vh] z-[10] max-w-[300px]"
          css={css`
            animation-duration: 6s;
          `}
        >
          <img
            alt="decor-dong-xu"
            src="/images/decor-coin-left.webp"
            className="relative z-[5] w-32 translate-x-[-40%] object-contain object-center md:w-48"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.8, ease: "easeInOut" } }}
          className="floating absolute bottom-[20vh] left-12 z-[50] max-w-[300px] md:left-24"
          css={css`
            animation-duration: 6s;
          `}
        >
          <img
            alt="decor-dong-xu"
            src="/images/decor-coin-left.webp"
            className="relative z-[5] w-24 object-contain object-center md:w-32"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.4, ease: "easeInOut" } }}
          className="floating absolute bottom-[20vh] right-[0%] z-[55] max-w-[300px]"
          css={css`
            animation-duration: 4s;
          `}
        >
          <img
            alt="decor-dong-xu"
            src="/images/decor-coin-right.webp"
            className="relative z-[5] w-64 translate-x-[40%] object-contain object-center md:w-[40vw]"
          />
        </motion.div>
      </div>
    </>
  );
};
