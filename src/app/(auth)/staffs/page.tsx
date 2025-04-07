import dynamic from "next/dynamic";

const StaffSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function SalesPage() {
  return (
    <main>
      <StaffSection />
    </main>
  );
}
