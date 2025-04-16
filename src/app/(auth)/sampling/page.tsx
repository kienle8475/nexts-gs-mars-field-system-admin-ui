import dynamic from "next/dynamic";

const SamplingSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function SamplingPage() {
  return (
    <main>
      <SamplingSection />
    </main>
  );
}
