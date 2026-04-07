"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const q = query(collection(db, "teams"), orderBy("name"));
        const snap = await getDocs(q);
        setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Teams</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Browse all esports teams in our database.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-neutral-500">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">No teams found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teams.map((team) => (
            <Link 
              key={team.id} 
              href={`/teams/${team.slug}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50 p-4 dark:bg-neutral-950">
                {team.logoLight || team.logoDark ? (
                  <>
                    {team.logoLight && (
                      <Image src={team.logoLight} alt={team.name} fill className="object-contain p-4 dark:hidden" unoptimized />
                    )}
                    {team.logoDark && (
                      <Image src={team.logoDark} alt={team.name} fill className="hidden object-contain p-4 dark:block" unoptimized />
                    )}
                    {!team.logoDark && team.logoLight && (
                      <Image src={team.logoLight} alt={team.name} fill className="hidden object-contain p-4 dark:block" unoptimized />
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold text-neutral-300 dark:text-neutral-700">
                    {team.shortCode || team.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-center font-display text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {team.displayName || team.name}
              </h2>
              {team.country && (
                <p className="mt-1 text-xs text-neutral-500">{team.country}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
