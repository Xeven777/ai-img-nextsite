import Generator from "@/components/generator";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Generator />
    </main>
  );
}
