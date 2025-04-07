"use client";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalContextProvider } from "@/contexts/global.context";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "@/contexts/auth.context";
import { Spinner } from "../elements/spinner";
import { Toaster as ToasterSonner } from "sonner";
import { ConfigProvider } from "antd";
import { lightTheme } from "@/config/antd-theme.config";
import { WSProvider } from "@/contexts/ws.context";
import "moment/locale/vi";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = (props: ProvidersProps) => {
  const { children } = props;

  return (
    <ConfigProvider theme={{ ...lightTheme } as any}>
      <Suspense
        fallback={
          <section className="mx-auto min-w-[320px] max-w-[640px]">
            <div className="bg-background-0dp flex min-h-screen items-center justify-center px-[24px] py-[32px]">
              <Spinner.B size={60} speed={500} stroke={3} />
            </div>
          </section>
        }
      >
        <ErrorBoundary FallbackComponent={() => <></>}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <GlobalContextProvider>
                <WSProvider>{children}</WSProvider>
              </GlobalContextProvider>
            </AuthContextProvider>

            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 3000 }}
              containerStyle={{ fontSize: 14, color: "#4c4c4c" }}
            />
            <ToasterSonner position="top-right" expand={true} closeButton={true} richColors />
          </QueryClientProvider>
        </ErrorBoundary>
      </Suspense>
    </ConfigProvider>
  );
};

export default Providers;
