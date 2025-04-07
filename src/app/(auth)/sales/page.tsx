import dynamic from "next/dynamic";

const SalesSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function SalesPage() {
  return (
    <main>
      <SalesSection />
    </main>
  );
}
