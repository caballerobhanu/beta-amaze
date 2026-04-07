"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, MapPin, Trophy, Calendar, Users } from "lucide-react";

export default function PlayerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [player, setPlayer] = useState<any>(null);
  const [game, setGame] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const q = query(collection(db, "players"), where("slug", "==", slug));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const data: any = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setPlayer(data);

          // Fetch Game
          if (data.gameId) {
            const gameQ = query(collection(db, "games"), where("__name__", "==", data.gameId));
            const gameSnap = await getDocs(gameQ);
            if (!gameSnap.empty) {
              setGame({ id: gameSnap.docs[0].id, ...gameSnap.docs[0].data() });
            }
          }

          // Fetch Team
          if (data.currentTeamId) {
            const teamSnap = await getDoc(doc(db, "teams", data.currentTeamId));
            if (teamSnap.exists()) {
              setTeam({ id: teamSnap.id, ...teamSnap.data() });
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading player...</div>;
  if (!player) return <div className="container mx-auto px-4 py-12 text-center text-xl font-bold">Player not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <Link href="/players" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Players
      </Link>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Photo & Basic Info */}
          <div className="flex flex-col items-center border-b border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950 md:w-1/3 md:border-b-0 md:border-r">
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
              {player.photos && player.photos.length > 0 ? (
                <Image src={player.photos[0]} alt={player.ign} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-6xl font-bold text-neutral-400 dark:text-neutral-600">
                    {player.ign.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <h1 className="text-center font-display text-4xl font-bold">{player.ign}</h1>
            {player.fullName && <p className="mt-1 text-lg text-neutral-500">{player.fullName}</p>}
            
            <div className="mt-8 w-full space-y-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              {team && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Current Team</p>
                  <Link href={`/teams/${team.slug}`} className="mt-1 flex items-center gap-2 font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {team.logoLight || team.logoDark ? (
                      <div className="relative h-6 w-6">
                        <Image src={team.logoLight || team.logoDark} alt={team.name} fill className="object-contain" unoptimized />
                      </div>
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    {team.displayName || team.name}
                  </Link>
                </div>
              )}

              {game && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Game</p>
                  <p className="mt-1 font-medium">{game.name}</p>
                </div>
              )}

              {player.country && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Nationality</p>
                  <p className="mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    {player.country}
                  </p>
                </div>
              )}

              {player.dob && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Date of Birth</p>
                  <p className="mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    {new Date(player.dob).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase text-neutral-500">Status</p>
                <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  player.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  player.status === 'retired' ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {player.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & History */}
          <div className="flex-1 p-8">
            <h2 className="mb-6 font-display text-2xl font-bold">Biography</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {player.fullName ? `${player.fullName}, better known as ` : ''}
              <strong>{player.ign}</strong> is a professional {game ? game.name : 'esports'} player
              {player.country ? ` from ${player.country}` : ''}
              {team ? ` currently playing for ${team.displayName || team.name}` : ''}.
            </p>

            {/* Placeholder for Match History / Achievements */}
            <div className="mt-12">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Recent Achievements
              </h2>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
                <p className="text-neutral-500">Tournament results and statistics will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
