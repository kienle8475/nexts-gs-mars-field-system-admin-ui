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
  title: "Vinamilk Field Service",
  description: "Vinamilk Field Service",
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
        <NextTopLoader color="#1d35e0" showSpinner={false} />
        <ProvidersDynamic>{children}</ProvidersDynamic>
      </body>
    </html>
  );
}
