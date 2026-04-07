import Link from "next/link";
import { LayoutDashboard, Gamepad2, Trophy, Users, User, Image as ImageIcon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 md:w-64 flex-shrink-0">
        <div className="p-6">
          <h2 className="font-display text-lg font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Manage your database</p>
        </div>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/admin/games" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <Gamepad2 className="h-4 w-4" />
            Games
          </Link>
          <Link href="/admin/tournaments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <Trophy className="h-4 w-4" />
            Tournaments
          </Link>
          <Link href="/admin/teams" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <Users className="h-4 w-4" />
            Teams
          </Link>
          <Link href="/admin/players" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <User className="h-4 w-4" />
            Players
          </Link>
          <div className="my-2 border-t border-neutral-200 dark:border-neutral-800"></div>
          <Link href="/admin/upload" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
            <ImageIcon className="h-4 w-4" />
            Image Upload
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
