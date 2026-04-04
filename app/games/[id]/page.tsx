import { games } from "@/data/games";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = games.find((g) => g.id === id);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24">
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to games
      </Link>
      
      <div className="mb-12">
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          {game.name}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Database for {game.name} tournaments, teams, and players.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Tournaments</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Browse recent and upcoming tournaments.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Teams</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Explore team rosters and statistics.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Players</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Find player profiles and achievements.</p>
        </div>
      </div>
    </div>
  );
}
