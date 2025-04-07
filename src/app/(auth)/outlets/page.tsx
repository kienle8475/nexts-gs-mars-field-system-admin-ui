import dynamic from "next/dynamic";

const OutletsSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function OutletsPage() {
  return (
    <main>
      <OutletsSection />
    </main>
  );
}
