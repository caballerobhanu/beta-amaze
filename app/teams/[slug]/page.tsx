"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, MapPin, Trophy } from "lucide-react";

export default function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [team, setTeam] = useState<any>(null);
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, "teams"), where("slug", "==", slug));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const teamData: any = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setTeam(teamData);

          if (teamData.gameId) {
            const gameQ = query(collection(db, "games"), where("__name__", "==", teamData.gameId));
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
    fetchTeam();
  }, [slug]);

  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Loading team...</div>;
  if (!team) return <div className="container mx-auto px-4 py-12 text-center text-xl font-bold">Team not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <Link href="/teams" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Link>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Logo & Basic Info */}
          <div className="flex flex-col items-center border-b border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950 md:w-1/3 md:border-b-0 md:border-r">
            <div className="relative mb-6 flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
              {team.logoLight || team.logoDark ? (
                <>
                  {team.logoLight && (
                    <Image src={team.logoLight} alt={team.name} fill className="object-contain p-6 dark:hidden" unoptimized />
                  )}
                  {team.logoDark && (
                    <Image src={team.logoDark} alt={team.name} fill className="hidden object-contain p-6 dark:block" unoptimized />
                  )}
                  {!team.logoDark && team.logoLight && (
                    <Image src={team.logoLight} alt={team.name} fill className="hidden object-contain p-6 dark:block" unoptimized />
                  )}
                </>
              ) : (
                <span className="text-5xl font-bold text-neutral-300 dark:text-neutral-700">
                  {team.shortCode || team.name.charAt(0)}
                </span>
              )}
            </div>
            
            <h1 className="text-center font-display text-3xl font-bold">{team.displayName || team.name}</h1>
            
            <div className="mt-6 w-full space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              {team.shortCode && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Short Code</p>
                  <p className="font-medium">{team.shortCode}</p>
                </div>
              )}
              {team.country && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Location</p>
                  <p className="flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    {team.country}
                  </p>
                </div>
              )}
              {game && (
                <div>
                  <p className="text-xs font-bold uppercase text-neutral-500">Game</p>
                  <p className="font-medium">{game.name}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase text-neutral-500">Status</p>
                <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  team.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                }`}>
                  {team.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Roster */}
          <div className="flex-1 p-8">
            <h2 className="mb-6 font-display text-2xl font-bold">Overview</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {team.displayName || team.name} is a professional esports team competing in {game?.name || "various titles"}.
            </p>

            {/* Placeholder for Roster */}
            <div className="mt-12">
              <h2 className="mb-6 font-display text-2xl font-bold">Active Roster</h2>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
                <p className="text-neutral-500">Roster data will be displayed here.</p>
              </div>
            </div>

            {/* Placeholder for Achievements */}
            <div className="mt-12">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Recent Achievements
              </h2>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
                <p className="text-neutral-500">Tournament results will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
