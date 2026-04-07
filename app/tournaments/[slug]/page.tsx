"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, MonitorPlay } from "lucide-react";

export default function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [tournament, setTournament] = useState<any>(null);
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const q = query(collection(db, "tournaments"), where("slug", "==", slug));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setTournament(data);

          if (data.gameId) {
            const gameQ = query(collection(db, "games"), where("__name__", "==", data.gameId));
            const gameSnap = await getDocs(gameQ);
            if (!gameSnap.empty) {
              setGame({ id: gameSnap.docs[0].id, ...gameSnap.docs[0].data() });
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading tournament...</div>;
  if (!tournament) return <div className="container mx-auto px-4 py-12 text-center text-xl font-bold">Tournament not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <Link href="/tournaments" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tournaments
      </Link>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* Hero Banner */}
        <div className="relative h-64 w-full bg-neutral-900 md:h-80">
          {tournament.coverImage ? (
            <Image src={tournament.coverImage} alt={tournament.name} fill className="object-cover opacity-60" unoptimized />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-80" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-start p-8 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-6">
              {tournament.thumbnail && (
                <div className="relative hidden h-32 w-32 overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl dark:border-neutral-900 dark:bg-neutral-950 md:block">
                  <Image src={tournament.thumbnail} alt={tournament.name} fill className="object-contain p-2" unoptimized />
                </div>
              )}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    {tournament.tier || "Event"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    tournament.status === 'completed' ? 'bg-neutral-600 text-white' :
                    tournament.status === 'ongoing' ? 'bg-green-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {tournament.status || 'Upcoming'}
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-white md:text-5xl">{tournament.name}</h1>
                {game && <p className="mt-2 font-medium text-neutral-300">{game.name}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar Info */}
          <div className="border-b border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950 md:border-b-0 md:border-r">
            <h3 className="mb-6 font-display text-lg font-bold">Tournament Details</h3>
            
            <div className="space-y-6">
              {tournament.prizePool && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Prize Pool</p>
                  <p className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                    <Trophy className="h-4 w-4" />
                    {tournament.prizePool}
                  </p>
                </div>
              )}
              
              {(tournament.startDate || tournament.endDate) && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Dates</p>
                  <p className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'TBD'} 
                    {tournament.endDate ? ` - ${new Date(tournament.endDate).toLocaleDateString()}` : ''}
                  </p>
                </div>
              )}

              {tournament.location && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Location</p>
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    {tournament.location}
                  </p>
                </div>
              )}

              {tournament.eventType && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Format</p>
                  <p className="flex items-center gap-2 font-medium">
                    <MonitorPlay className="h-4 w-4 text-neutral-400" />
                    {tournament.eventType}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-2 p-8">
            {/* Placeholder for Participating Teams */}
            <div className="mb-12">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold">
                <Users className="h-6 w-6 text-blue-500" />
                Participating Teams
              </h2>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
                <p className="text-neutral-500">Teams and rosters will be displayed here.</p>
              </div>
            </div>

            {/* Placeholder for Results/Brackets */}
            <div>
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Results & Brackets
              </h2>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
                <p className="text-neutral-500">Match history and brackets will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
