import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";

export default function LandingPage() {
  return (
    <section className="space-y-8">
      <Card className="flex flex-col items-center gap-5 py-12 text-center">
        <Image src="/logo.png" alt="Trade Champ" width={140} height={140} className="h-auto w-24 md:w-36" priority />
        <h1 className="text-4xl font-extrabold md:text-6xl">Trade Champ</h1>
        <p className="max-w-3xl text-slate-300">
          Automated MT5 trade journaling, prop-firm risk tracking, and advanced analytics in one futuristic dashboard.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="rounded-md bg-neon px-5 py-2 font-semibold text-slate-900">Start Free</Link>
          <Link href="/dashboard" className="rounded-md border border-slate-600 px-5 py-2 font-semibold">View Demo</Link>
        </div>
      </Card>
    </section>
  );
}
