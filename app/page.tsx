import Link from "next/link";
import Image from "next/image";
import { games } from "@/data/games";
import { Search, TrendingUp, Clock, Calendar } from "lucide-react";
import { logoDefault } from "@/lib/logos";

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 py-12 md:px-8 lg:py-24">
      {/* Main Search Section (Google/Edge style) */}
      <div className="flex w-full flex-col items-center justify-center space-y-12 pt-12 md:pt-24">
        <div className="relative h-16 w-64 md:h-20 md:w-80">
          <Image
            src={logoDefault}
            alt="EsportsAmaze"
            fill
            unoptimized
            className="object-contain"
            priority
          />
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search esports titles, tournaments, teams..."
            className="h-14 w-full rounded-full border border-neutral-200 bg-white pl-12 pr-4 text-base shadow-lg transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-blue-500"
          />
        </div>

        {/* Top Visited Sections - Broader than search box */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 pt-8 md:grid-cols-3">
          {/* Past 24 Hours */}
          <div className="flex flex-col space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Past 24 Hours</span>
            </div>
            <div className="flex flex-col space-y-2.5">
              <Link href="/players/mortal" className="text-sm font-medium hover:text-blue-600 transition-colors">Team Soul Roster Update</Link>
              <Link href="/games/cs2" className="text-sm font-medium hover:text-blue-600 transition-colors">Skyesports Masters Day 1</Link>
              <Link href="/tournaments/bgmi-pro" className="text-sm font-medium hover:text-blue-600 transition-colors">BGMI Pro Series Live</Link>
              <Link href="/teams/godlike" className="text-sm font-medium hover:text-blue-600 transition-colors">GodLike New Signing</Link>
              <Link href="/games/valorant" className="text-sm font-medium hover:text-blue-600 transition-colors">VCL South Asia Results</Link>
              <Link href="/players/scout" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">ScoutOP Interview</Link>
              <Link href="/tournaments/pmgc" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">PMGC 2024 Schedule</Link>
            </div>
          </div>

          {/* Past Week */}
          <div className="flex flex-col space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Past Week</span>
            </div>
            <div className="flex flex-col space-y-2.5">
              <Link href="/tournaments/bgmi-masters" className="text-sm font-medium hover:text-blue-600 transition-colors">BGMI Masters Series Finals</Link>
              <Link href="/teams/godlike" className="text-sm font-medium hover:text-blue-600 transition-colors">GodLike Esports Bootcamp</Link>
              <Link href="/games/pubg-mobile" className="text-sm font-medium hover:text-blue-600 transition-colors">PUBG Mobile India Launch</Link>
              <Link href="/players/jonathan" className="text-sm font-medium hover:text-blue-600 transition-colors">Jonathan MVP Performance</Link>
              <Link href="/tournaments/valorant-india" className="text-sm font-medium hover:text-blue-600 transition-colors">Valorant India Cup</Link>
              <Link href="/teams/soul" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">Team Soul Expansion</Link>
              <Link href="/games/dota2" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">Dota 2 India Open</Link>
            </div>
          </div>

          {/* Overall */}
          <div className="flex flex-col space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Overall</span>
            </div>
            <div className="flex flex-col space-y-2.5">
              <Link href="/games/pubg-mobile" className="text-sm font-medium hover:text-blue-600 transition-colors">PUBG Mobile India Hub</Link>
              <Link href="/games/valorant" className="text-sm font-medium hover:text-blue-600 transition-colors">Valorant South Asia Hub</Link>
              <Link href="/teams/soul" className="text-sm font-medium hover:text-blue-600 transition-colors">Team Soul History</Link>
              <Link href="/teams/godlike" className="text-sm font-medium hover:text-blue-600 transition-colors">GodLike Esports Profile</Link>
              <Link href="/players/mortal" className="text-sm font-medium hover:text-blue-600 transition-colors">Mortal Profile & Stats</Link>
              <Link href="/tournaments/bgmi-masters" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">BGMS All Seasons</Link>
              <Link href="/games/cs2" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">CS2 India Scene</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
