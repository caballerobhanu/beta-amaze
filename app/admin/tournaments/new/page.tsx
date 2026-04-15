"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export default function NewTournamentPage() {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "", shortName: "", slug: "", gameId: "", status: "upcoming",
    series: "", parentTournamentId: "", tier: "S-Tier", eventType: "Online",
    locations: [] as { label: string; venue: string }[],
    prizePools: [] as { currency: string; amount: string }[],
    startDate: "", endDate: "", coverImage: "", thumbnailLight: "", thumbnailDark: "",
    organizers: [] as string[], publishers: [] as string[], sponsors: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [gamesSnap, tourneysSnap] = await Promise.all([
        getDocs(collection(db, "games")),
        getDocs(collection(db, "tournaments"))
      ]);
      setGames(gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTournaments(tourneysSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      const end = formData.endDate ? new Date(formData.endDate) : start;
      const now = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      let newStatus = formData.status;
      if (now < start) newStatus = "upcoming";
      else if (now >= start && now <= end) newStatus = "ongoing";
      else if (now > end) newStatus = "completed";
      
      if (newStatus !== formData.status) setFormData(prev => ({ ...prev, status: newStatus }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (field: string, url: string) => setFormData({ ...formData, [field]: url });

  const addArrayItem = (field: string, defaultValue: any) => {
    setFormData({ ...formData, [field]: [...(formData as any)[field], defaultValue] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData as any)[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const renderStringArray = (field: 'organizers' | 'publishers' | 'sponsors', label: string) => (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        <button type="button" onClick={() => addArrayItem(field, '')} className="flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          <Plus className="mr-1 h-4 w-4" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {formData[field].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item} onChange={e => {
              const newArr = [...formData[field]];
              newArr[i] = e.target.value;
              setFormData({ ...formData, [field]: newArr });
            }} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 focus:border-red-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950" placeholder={`Enter ${label.toLowerCase()}...`} />
            <button type="button" onClick={() => removeArrayItem(field, i)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const docData: any = { ...formData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      docData.locations = docData.locations.filter((l: any) => l.label || l.venue);
      docData.prizePools = docData.prizePools.filter((p: any) => p.amount);
      docData.organizers = docData.organizers.filter((o: string) => o.trim() !== "");
      docData.publishers = docData.publishers.filter((p: string) => p.trim() !== "");
      docData.sponsors = docData.sponsors.filter((s: string) => s.trim() !== "");

      Object.keys(docData).forEach(key => { if (docData[key] === "") delete docData[key]; });
      await addDoc(collection(db, "tournaments"), docData);
      router.push("/admin/tournaments");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/tournaments" className="mb-6 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tournaments
      </Link>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Create New Tournament</h1>
      </div>
      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Basic Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Tournament Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Short Name</label>
              <input name="shortName" value={formData.shortName} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Game *</label>
              <select required name="gameId" value={formData.gameId} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="">Select a game...</option>
                {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status *</label>
              <select required name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Series / Season</label>
              <input name="series" value={formData.series} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Parent Tournament</label>
              <select name="parentTournamentId" value={formData.parentTournamentId} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="">None</option>
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Event Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Tier</label>
              <select name="tier" value={formData.tier} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="S-Tier">S-Tier</option><option value="A-Tier">A-Tier</option><option value="B-Tier">B-Tier</option>
                <option value="C-Tier">C-Tier</option><option value="Qualifier">Qualifier</option><option value="Showmatch">Showmatch</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                <option value="Online">Online</option><option value="LAN">LAN</option><option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Locations / Venues</label>
                <button type="button" onClick={() => addArrayItem('locations', { label: '', venue: '' })} className="flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  <Plus className="mr-1 h-4 w-4" /> Add Location
                </button>
              </div>
              <div className="space-y-2">
                {formData.locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input placeholder="Label (e.g. Semis)" value={loc.label} onChange={e => {
                      const newLocs = [...formData.locations]; newLocs[i].label = e.target.value; setFormData({...formData, locations: newLocs});
                    }} className="w-1/3 rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
                    <input placeholder="Venue (e.g. Chennai)" value={loc.venue} onChange={e => {
                      const newLocs = [...formData.locations]; newLocs[i].venue = e.target.value; setFormData({...formData, locations: newLocs});
                    }} className="w-2/3 rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
                    <button type="button" onClick={() => removeArrayItem('locations', i)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-5 w-5" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Prize Pool (Max 5)</label>
                {formData.prizePools.length < 5 && (
                  <button type="button" onClick={() => addArrayItem('prizePools', { currency: 'USD', amount: '' })} className="flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                    <Plus className="mr-1 h-4 w-4" /> Add Currency
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {formData.prizePools.map((pool, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select value={pool.currency} onChange={e => {
                      const newPools = [...formData.prizePools]; newPools[i].currency = e.target.value; setFormData({...formData, prizePools: newPools});
                    }} className="w-1/3 rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950">
                      <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option><option value="KRW">KRW (₩)</option><option value="CNY">CNY (¥)</option>
                    </select>
                    <input placeholder="Amount (e.g. 1,000,000)" value={pool.amount} onChange={e => {
                      const newPools = [...formData.prizePools]; newPools[i].amount = e.target.value; setFormData({...formData, prizePools: newPools});
                    }} className="w-2/3 rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-950" />
                    <button type="button" onClick={() => removeArrayItem('prizePools', i)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-5 w-5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Stakeholders</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {renderStringArray('organizers', 'Organizers (TO)')}
            {renderStringArray('publishers', 'Publishers')}
            {renderStringArray('sponsors', 'Sponsors')}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-display text-xl font-bold">Images</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-3">
              <ImageUpload label="Cover Image (Banner)" value={formData.coverImage} onChange={(url) => handleImageChange("coverImage", url)} folder="tournaments" />
            </div>
            <ImageUpload label="Thumbnail (Light Mode)" value={formData.thumbnailLight} onChange={(url) => handleImageChange("thumbnailLight", url)} folder="tournaments" />
            <ImageUpload label="Thumbnail (Dark Mode)" value={formData.thumbnailDark} onChange={(url) => handleImageChange("thumbnailDark", url)} folder="tournaments" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600">
            <Save className="h-5 w-5" /> {loading ? "Saving..." : "Save Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
}
