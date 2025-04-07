import dynamic from "next/dynamic";

const OOSSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function OOSPage() {
  return (
    <main>
      <OOSSection />
    </main>
  );
}
