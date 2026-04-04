import Link from "next/link";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 md:px-8 lg:py-24">
      <div className="mb-16 text-center">
        <h1 className="font-display text-6xl font-black italic tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="text-neutral-900 dark:text-white">ENC</span>
        </h1>
        <p className="mt-6 text-sm font-bold tracking-[0.2em] text-neutral-800 dark:text-neutral-200 uppercase sm:text-base md:text-lg">
          India will compete in 11 esports titles
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group flex h-32 items-center justify-center rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] dark:bg-neutral-900 dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.03)] dark:hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.06)]"
          >
            <span className="font-display text-2xl font-black tracking-tight text-neutral-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-500">
              {game.logoText}
            </span>
          </Link>
        ))}
      </div>
      
      <div className="mt-24 text-center">
        <span className="font-display text-2xl font-bold tracking-tight text-red-600 dark:text-red-500">esportsamaze</span>
      </div>
    </div>
  );
}
