"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export default function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    slug: "",
    shortCode: "",
    gameId: "",
    country: "",
    status: "active",
    logoLight: "",
    logoDark: "",
  });

  useEffect(() => {
    const fetchGamesAndTeam = async () => {
      try {
        const gamesSnap = await getDocs(collection(db, "games"));
        setGames(gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const teamSnap = await getDoc(doc(db, "teams", id));
        if (teamSnap.exists()) {
          const data = teamSnap.data();
          setFormData({
            name: data.name || "",
            displayName: data.displayName || "",
            slug: data.slug || "",
            shortCode: data.shortCode || "",
            gameId: data.gameId || "",
            country: data.country || "",
            status: data.status || "active",
            logoLight: data.logoLight || "",
            logoDark: data.logoDark || "",
          });
        } else {
          setError("Team not found.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchGamesAndTeam();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (field: string, url: string) => {
    setFormData({ ...formData, [field]: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const docData = {
        ...formData,
        updatedAt: serverTimestamp(),
      };
      
      // Clean up empty strings
      Object.keys(docData).forEach(key => {
        if ((docData as any)[key] === "") {
          delete (docData as any)[key];
        }
      });

      await updateDoc(doc(db, "teams", id), docData);
      router.push("/admin/teams");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isAuthReady || fetching) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/teams" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Edit Team</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Update team information.</p>
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
              <label className="mb-2 block text-sm font-medium">Base Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Team SouL" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Display Name *</label>
              <input required name="displayName" value={formData.displayName} onChange={handleChange} placeholder="e.g. iQOO SouL" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. team-soul-bgmi" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Short Code</label>
              <input name="shortCode" value={formData.shortCode} onChange={handleChange} placeholder="e.g. SOUL" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
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
              <label className="mb-2 block text-sm font-medium">Country</label>
              <input name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="disbanded">Disbanded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Logos</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload 
              label="Logo (Light Mode)" 
              value={formData.logoLight} 
              onChange={(url) => handleImageChange("logoLight", url)} 
              folder="teams"
            />
            <ImageUpload 
              label="Logo (Dark Mode)" 
              value={formData.logoDark} 
              onChange={(url) => handleImageChange("logoDark", url)} 
              folder="teams"
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
