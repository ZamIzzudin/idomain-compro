"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useMyPreferences, useUpdatePreferences } from "@/services/career/hook";
import { useCategoryList } from "@/services/career/hook";
import {
  subscribeToPush,
  unsubscribeFromPush,
  sendTestNotification,
  isPushSupported,
} from "@/lib/push";

export default function PreferencePanel() {
  const { data: prefs, isLoading } = useMyPreferences();
  const { data: categories } = useCategoryList();
  const { mutate: update, isPending } = useUpdatePreferences();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifReceiveAll, setNotifReceiveAll] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const pushSupported = isPushSupported();

  useEffect(() => {
    if (prefs && !initialized) {
      setNotifEnabled(prefs.notifEnabled);
      setNotifReceiveAll(prefs.notifReceiveAll);
      setSelectedCategories(prefs.preferredCategories || []);
      setInitialized(true);
    }
  }, [prefs, initialized]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleToggleNotif = async () => {
    const newValue = !notifEnabled;

    if (newValue && pushSupported) {
      const success = await subscribeToPush();
      if (!success) {
        toast.error(
          "Gagal mengaktifkan notifikasi. Pastikan browser mendukung push dan Anda memberikan izin.",
        );
        return;
      }
    } else if (!newValue && pushSupported) {
      await unsubscribeFromPush();
    }

    setNotifEnabled(newValue);
  };

  const handleSave = () => {
    update(
      {
        notifEnabled,
        notifReceiveAll,
        preferredCategories: selectedCategories,
      },
      {
        onSuccess: () => toast.success("Preferensi notifikasi disimpan"),
        onError: () => toast.error("Gagal menyimpan preferensi"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3 mb-4" />
        <div className="h-10 bg-slate-100 rounded mb-3" />
        <div className="h-10 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-brand-steel" />
        <h2 className="text-lg font-bold text-slate-800">
          Preferensi Notifikasi Karir
        </h2>
      </div>

      <p className="text-sm text-slate-500">
        Atur preferensi Anda untuk menerima pemberitahuan lowongan kerja baru
        berdasarkan kategori.
      </p>

      {/* Toggle notifEnabled */}
      <div className="flex items-center justify-between py-3 border-y border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Aktifkan Notifikasi
          </p>
          <p className="text-xs text-slate-400">
            {pushSupported
              ? "Terima pemberitahuan lowongan baru di browser"
              : "Browser Anda tidak mendukung push notification"}
          </p>
        </div>
        <button
          onClick={handleToggleNotif}
          disabled={!pushSupported}
          className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            notifEnabled ? "bg-brand-steel" : "bg-slate-200"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              notifEnabled ? "translate-x-1" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {notifEnabled && (
        <>
          {/* Toggle receiveAll */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Terima Semua Lowongan
              </p>
              <p className="text-xs text-slate-400">
                Dapatkan notifikasi untuk semua lowongan, bukan hanya kategori
                yang dipilih
              </p>
            </div>
            <button
              onClick={() => setNotifReceiveAll(!notifReceiveAll)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifReceiveAll ? "bg-brand-steel" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifReceiveAll ? "translate-x-1" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Category selection */}
          {!notifReceiveAll && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">
                Pilih Kategori Preferensi
              </p>

              {/* Non-Klinis first (simpler) */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Non-Klinis & Lainnya
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    ?.filter((c) => c.type === "NON_KLINIS")
                    .map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedCategories.includes(cat.name)
                            ? "bg-brand-steel text-white border-brand-steel"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Klinis */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Klinis / Spesialis
                </p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {categories
                    ?.filter((c) => c.type === "KLINIS")
                    .map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedCategories.includes(cat.name)
                            ? "bg-brand-steel text-white border-brand-steel"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                </div>
              </div>

              <p className="text-xs text-slate-400">
                {selectedCategories.length} kategori dipilih
              </p>
            </div>
          )}

          {/* Save + Test buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-steel text-white rounded-xl font-medium hover:bg-brand-steel/80 transition-colors text-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isPending ? "Menyimpan..." : "Simpan Preferensi"}
            </button>
            {/* <button
              onClick={() =>
                sendTestNotification().then((ok) =>
                  ok
                    ? toast.success("Test notifikasi terkirim")
                    : toast.error("Gagal mengirim test notifikasi")
                )
              }
              disabled={!pushSupported}
              className="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm disabled:opacity-40"
            >
              Test
            </button> */}
          </div>
        </>
      )}

      {!notifEnabled && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <BellOff className="w-4 h-4" />
          Notifikasi karir sedang nonaktif
        </div>
      )}
    </div>
  );
}
