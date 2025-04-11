import dynamic from "next/dynamic";

const WorkingShiftSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function WorkingShiftPage() {
  return (
    <main>
      <WorkingShiftSection />
    </main>
  );
}
