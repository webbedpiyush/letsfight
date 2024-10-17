import BgGrid from "@/components/BgGrid";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      <BgGrid/>
      <div className="relative z-10 p-4">
        <h1 className="text-4xl font-bold">Let's Cook Something</h1>
      </div>
    </main>
  );
}