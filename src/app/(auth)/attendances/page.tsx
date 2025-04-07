import dynamic from "next/dynamic";

const AttendanceSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function AttendancePage() {
  return (
    <main>
      <AttendanceSection />
    </main>
  );
}
