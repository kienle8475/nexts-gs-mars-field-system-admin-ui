import dynamic from "next/dynamic";

const GiftsSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function GiftsPage() {
  return (
    <main>
      <GiftsSection />
    </main>
  );
}
