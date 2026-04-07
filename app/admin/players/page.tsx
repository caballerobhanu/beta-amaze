"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import { Plus, Search } from "lucide-react";

export default function AdminPlayersPage() {
  const { user, isAuthReady } = useAuth();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchPlayers = async () => {
      try {
        const q = query(collection(db, "players"), orderBy("ign"));
        const snap = await getDocs(q);
        setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [user]);

  if (!isAuthReady) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage player profiles, history, and stats.</p>
        </div>
        <Link 
          href="/admin/players/new" 
          className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          Add Player
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search players..." 
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-neutral-500">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="mb-2 font-display text-lg font-bold">No players found</h3>
            <p className="text-neutral-500">Get started by creating your first player profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-950/50 dark:text-neutral-400">
                <tr>
                  <th className="px-6 py-3 font-medium">IGN</th>
                  <th className="px-6 py-3 font-medium">Full Name</th>
                  <th className="px-6 py-3 font-medium">Game ID</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {players.map(player => (
                  <tr key={player.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{player.ign}</td>
                    <td className="px-6 py-4 text-neutral-500">{player.fullName || '-'}</td>
                    <td className="px-6 py-4 text-neutral-500">{player.gameId}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        player.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        player.status === 'retired' ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {player.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/players/${player.id}`} className="text-blue-600 hover:underline dark:text-blue-400">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
