import Link from "next/link";
import { games } from "@/data/games";

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Games
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Browse our database of esports titles.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group flex h-32 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-neutral-900 dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)]"
          >
            <span className="font-display text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-500">
              {game.logoText}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
