import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Trade Champ logo"
            width={180}
            height={60}
            className="h-10 w-auto max-w-[140px] md:h-12 md:max-w-[180px]"
            priority
          />
        </Link>
        <div className="flex gap-3 text-sm">
          <Link href="/dashboard" className="text-slate-200 hover:text-neon">Dashboard</Link>
          <Link href="/trades" className="text-slate-200 hover:text-neon">Trades</Link>
          <Link href="/login" className="text-slate-200 hover:text-neon">Login</Link>
          <Link href="/signup" className="text-slate-200 hover:text-neon">Signup</Link>
        </div>
      </nav>
    </header>
  );
}
