"use client";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import { useAuthContext } from "@/contexts/auth.context";
import { Spinner } from "../elements/spinner";

interface RouterGuardProps {
  children: React.ReactNode;
}

const RouterGuard = (props: RouterGuardProps) => {
  const { children } = props;

  const authContext = useAuthContext();
  const authenticated = authContext.use.authenticated();
  const user = authContext.use.user();

  const pathname = usePathname();

  React.useEffect(() => {
    if (authenticated === undefined) return;

    if (authenticated && user) {
      console.log(`[🔒] Authenticated: `, user.username);
    }
  }, [authenticated]);

  if (authenticated === undefined) {
    return (
      <section className="mx-auto min-w-[320px] max-w-[640px]">
        <div className="bg-background-0dp flex min-h-screen items-center justify-center px-[24px] py-[32px]">
          <Spinner.B size={60} speed={0.5} stroke={3} />
        </div>
      </section>
    );
  }

  if (!authenticated) {
    redirect("/login");
  }

  return authenticated && children;
};

export default RouterGuard;
