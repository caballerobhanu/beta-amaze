import Link from "next/link";
import Image from "next/image";
import { games } from "@/data/games";
import { Search, TrendingUp, Clock, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 py-12 md:px-8 lg:py-24">
      {/* Main Search Section (Google/Edge style) */}
      <div className="flex w-full max-w-2xl flex-col items-center justify-center space-y-8 pt-12 md:pt-24">
        <div className="relative h-16 w-64 md:h-20 md:w-80">
          <Image
            src="/images/esportsamaze_long_default.png"
            alt="EsportsAmaze"
            fill
            className="object-contain dark:hidden"
            priority
          />
          <Image
            src="/images/esportsamaze_long_white.png"
            alt="EsportsAmaze"
            fill
            className="hidden object-contain dark:block"
            priority
          />
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search esports titles, tournaments, teams..."
            className="h-14 w-full rounded-full border border-neutral-200 bg-white pl-12 pr-4 text-base shadow-lg transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-blue-500"
          />
        </div>

        {/* Top Visited Sections */}
        <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-3">
          <div className="flex flex-col space-y-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Overall</span>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/games/pubg-mobile" className="text-sm font-medium hover:text-blue-600 transition-colors">PUBG Mobile India</Link>
              <Link href="/games/valorant" className="text-sm font-medium hover:text-blue-600 transition-colors">Valorant Challengers</Link>
            </div>
          </div>

          <div className="flex flex-col space-y-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Past Week</span>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/tournaments/bgmi-masters" className="text-sm font-medium hover:text-blue-600 transition-colors">BGMI Masters Series</Link>
              <Link href="/teams/godlike" className="text-sm font-medium hover:text-blue-600 transition-colors">GodLike Esports</Link>
            </div>
          </div>

          <div className="flex flex-col space-y-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Past 24 Hours</span>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/players/mortal" className="text-sm font-medium hover:text-blue-600 transition-colors">Team Soul Roster</Link>
              <Link href="/games/cs2" className="text-sm font-medium hover:text-blue-600 transition-colors">Skyesports Masters</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Game Titles Section */}
      <div className="mt-24 w-full">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">Browse Titles</h2>
          <Link href="/games" className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">View All</Link>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {games.slice(0, 12).map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group flex aspect-square flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-900"
            >
              <div className="flex h-full items-center justify-center text-center">
                <span className="font-display text-sm font-black tracking-tight text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {game.logoText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
