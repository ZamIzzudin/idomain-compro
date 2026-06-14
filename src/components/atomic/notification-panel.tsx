"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, X, Trash2 } from "lucide-react";
import {
  useUnreadCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllRead,
  useDeleteNotification,
} from "@/services/career/hook";
import { isAuthenticated } from "@/lib/auth";
import { useMyProfile } from "@/services/alumni/hook";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: alumni } = useMyProfile();
  const isLoggedIn = !!alumni;

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  const { data: notifData } = useNotifications({ limit: 10 });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const notifications = notifData?.items || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 hover:opacity-70 transition-opacity"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">
              Notifikasi
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="text-xs text-brand-steel hover:underline font-medium"
                >
                  Tandai semua dibaca
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-slate-50/50 transition-colors group ${
                      !notif.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notif.isRead && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={notif.url || "/career"}
                          onClick={() => {
                            if (!notif.isRead) markRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="block"
                        >
                          <p
                            className={`text-sm text-slate-800 ${
                              !notif.isRead ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {notif.body && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {notif.body}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            {formatTime(notif.createdAt)}
                          </p>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            onClick={() => markRead(notif.id)}
                            className="p-1 hover:bg-green-50 rounded"
                            title="Tandai dibaca"
                          >
                            <Check className="w-3 h-3 text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
