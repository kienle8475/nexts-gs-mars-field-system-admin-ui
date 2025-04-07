import dynamic from "next/dynamic";

const QRSection = dynamic(() => import("./components/section"), {
  ssr: false,
});

export default async function QRPage() {
  return (
    <main>
      <QRSection />
    </main>
  );
}
