"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, Trophy, MapPin } from "lucide-react";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const q = query(collection(db, "tournaments"), orderBy("name"));
        const snap = await getDocs(q);
        setTournaments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Tournaments</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Discover upcoming, ongoing, and past esports events.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-neutral-500">Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">No tournaments found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Link 
              key={tournament.id} 
              href={`/tournaments/${tournament.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800">
                {tournament.coverImage ? (
                  <Image src={tournament.coverImage} alt={tournament.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Trophy className="h-12 w-12 text-neutral-400 opacity-50" />
                  </div>
                )}
                <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {tournament.tier || "Event"}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <h2 className="mb-2 font-display text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                  {tournament.name}
                </h2>
                
                <div className="mt-auto space-y-2 pt-4">
                  {tournament.startDate && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {tournament.location && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-4 w-4" />
                      <span>{tournament.location} ({tournament.eventType})</span>
                    </div>
                  )}
                  {tournament.prizePool && (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                      <Trophy className="h-4 w-4" />
                      <span>{tournament.prizePool}</span>
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
