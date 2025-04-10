import dynamic from "next/dynamic";

const ReportItemSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function ReportItemPage() {
  return (
    <main>
      <ReportItemSection />
    </main>
  );
}
