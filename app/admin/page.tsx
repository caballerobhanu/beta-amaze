"use client";

import { useAuth } from "@/components/firebase-provider";
import Link from "next/link";
import { Gamepad2, Trophy, Users, User } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return <div className="p-8">Loading auth...</div>;

  if (!user) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
        Please sign in using the button in the header first. Your email must be caballero.bhanu@gmail.com to have admin rights.
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Welcome to the Control Center</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Manage your massive database of esports games, tournaments, teams, and players.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/games" className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">Games</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage titles and variants.</p>
        </Link>
        
        <Link href="/admin/tournaments" className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 inline-flex rounded-lg bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold group-hover:text-red-600 dark:group-hover:text-red-400">Tournaments</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage events, schedules, and results.</p>
        </Link>

        <Link href="/admin/teams" className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400">Teams</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage rosters, staff, and achievements.</p>
        </Link>

        <Link href="/admin/players" className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <User className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400">Players</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage player profiles and history.</p>
        </Link>
      </div>
    </div>
  );
}
