"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, MapPin } from "lucide-react";

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Players</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Browse professional esports players and talents.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-neutral-500">Loading players...</div>
      ) : players.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">No players found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {players.map((player) => (
            <Link 
              key={player.id} 
              href={`/players/${player.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800">
                {player.photos && player.photos.length > 0 ? (
                  <Image src={player.photos[0]} alt={player.ign} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                    <User className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {player.status || "Active"}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-display text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {player.ign}
                </h2>
                {player.fullName && (
                  <p className="text-sm text-neutral-500 line-clamp-1">{player.fullName}</p>
                )}
                
                <div className="mt-auto pt-4">
                  {player.country && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{player.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
