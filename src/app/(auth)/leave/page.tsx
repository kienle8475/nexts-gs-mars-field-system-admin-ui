import dynamic from "next/dynamic";

const LeaveSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function LeavePage() {
  return (
    <main>
      <LeaveSection />
    </main>
  );
}
