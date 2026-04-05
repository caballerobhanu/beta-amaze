"use client";

import { useParams } from "next/navigation";

export default function GameDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold">Game Details: {slug}</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        This page will show tournaments, teams, and players for this specific game.
      </p>
    </div>
  );
}
