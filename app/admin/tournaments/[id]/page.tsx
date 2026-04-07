"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export default function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    slug: "",
    gameId: "",
    status: "upcoming",
    tier: "S-Tier",
    eventType: "Online",
    location: "",
    prizePool: "",
    startDate: "",
    endDate: "",
    coverImage: "",
    thumbnail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesSnap = await getDocs(collection(db, "games"));
        setGames(gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const docSnap = await getDoc(doc(db, "tournaments", id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || "",
            shortName: data.shortName || "",
            slug: data.slug || "",
            gameId: data.gameId || "",
            status: data.status || "upcoming",
            tier: data.tier || "S-Tier",
            eventType: data.eventType || "Online",
            location: data.location || "",
            prizePool: data.prizePool || "",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            coverImage: data.coverImage || "",
            thumbnail: data.thumbnail || "",
          });
        } else {
          setError("Tournament not found.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
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
      
      Object.keys(docData).forEach(key => {
        if ((docData as any)[key] === "") {
          delete (docData as any)[key];
        }
      });

      await updateDoc(doc(db, "tournaments", id), docData);
      router.push("/admin/tournaments");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isAuthReady || fetching) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/tournaments" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tournaments
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Edit Tournament</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Update event information.</p>
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Tournament Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. The International 2026" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Short Name</label>
              <input name="shortName" value={formData.shortName} onChange={handleChange} placeholder="e.g. TI 2026" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. the-international-2026" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
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
              <label className="mb-2 block text-sm font-medium">Status *</label>
              <select required name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Event Details</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Tier</label>
              <select name="tier" value={formData.tier} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="S-Tier">S-Tier</option>
                <option value="A-Tier">A-Tier</option>
                <option value="B-Tier">B-Tier</option>
                <option value="C-Tier">C-Tier</option>
                <option value="Qualifier">Qualifier</option>
                <option value="Showmatch">Showmatch</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="Online">Online</option>
                <option value="LAN">LAN</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Location / Venue</label>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Seattle, WA" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Prize Pool</label>
              <input name="prizePool" value={formData.prizePool} onChange={handleChange} placeholder="e.g. $1,000,000" className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Images</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload 
              label="Cover Image (Banner)" 
              value={formData.coverImage} 
              onChange={(url) => handleImageChange("coverImage", url)} 
              folder="tournaments"
            />
            <ImageUpload 
              label="Thumbnail (Square)" 
              value={formData.thumbnail} 
              onChange={(url) => handleImageChange("thumbnail", url)} 
              folder="tournaments"
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
