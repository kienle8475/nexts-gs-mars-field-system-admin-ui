import type { Metadata } from "next";
import { cn } from "@/utils/common";
import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
import "./globals.scss";
import { fontVariables } from "./fonts";

const ProvidersDynamic = dynamic(() => import("@/components/layouts/providers"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "MARS Field Service",
  description: "MARS Field Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          ...fontVariables,
          "bg-gray--8 font-inter text-[14px] text-text-high-emp antialiased",
        )}
      >
        <NextTopLoader color="#f68b1e" showSpinner={false} />
        <ProvidersDynamic>{children}</ProvidersDynamic>
      </body>
    </html>
  );
}
