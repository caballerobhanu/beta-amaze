"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export default function NewPlayerPage() {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ign: "",
    fullName: "",
    slug: "",
    gameId: "",
    currentTeamId: "",
    country: "",
    dob: "",
    status: "active",
    photoUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [gamesSnap, teamsSnap] = await Promise.all([
        getDocs(collection(db, "games")),
        getDocs(collection(db, "teams"))
      ]);
      setGames(gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTeams(teamsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, photoUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const docData: any = {
        ign: formData.ign,
        fullName: formData.fullName,
        slug: formData.slug,
        gameId: formData.gameId,
        currentTeamId: formData.currentTeamId,
        country: formData.country,
        dob: formData.dob,
        status: formData.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (formData.photoUrl) {
        docData.photos = [formData.photoUrl];
      }
      
      Object.keys(docData).forEach(key => {
        if (docData[key] === "") {
          delete docData[key];
        }
      });

      await addDoc(collection(db, "players"), docData);
      router.push("/admin/players");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/players" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Players
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Create New Player</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Add a new player profile to the database.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Basic Information</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">In-Game Name (IGN) *</label>
              <input required name="ign" value={formData.ign} onChange={handleChange} placeholder="e.g. Faker" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Lee Sang-hyeok" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. faker" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Game *</label>
              <select required name="gameId" value={formData.gameId} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="">Select a game...</option>
                {games.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Current Team</label>
              <select name="currentTeamId" value={formData.currentTeamId} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="">None / Free Agent</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status *</label>
              <select required name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="retired">Retired</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Country</label>
              <input name="country" value={formData.country} onChange={handleChange} placeholder="e.g. South Korea" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Player Photo</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload 
              label="Main Photo" 
              value={formData.photoUrl} 
              onChange={handleImageChange} 
              folder="players"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
          >
            <Save className="h-5 w-5" />
            {loading ? "Saving..." : "Save Player"}
          </button>
        </div>
      </form>
    </div>
  );
}
