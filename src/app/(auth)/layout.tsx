import dynamic from "next/dynamic";

const LayoutContainer = dynamic(() => import("@/components/layouts/container"), {
  ssr: false,
});

const RouterGuardDynamic = dynamic(() => import("@/components/layouts/auth-guard"), {
  ssr: false,
});

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RouterGuardDynamic>
      <LayoutContainer>{children}</LayoutContainer>
    </RouterGuardDynamic>
  );
}
