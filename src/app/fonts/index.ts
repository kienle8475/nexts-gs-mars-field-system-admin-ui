import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";

const heineken = localFont({
  variable: "--font-heineken",
  src: [
    {
      path: "./heineken/heineken-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./heineken/heineken-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./heineken/heineken-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const fonts: NextFontWithVariable[] = [heineken];

export const fontVariables: string[] = fonts.map((font) => font.variable);
