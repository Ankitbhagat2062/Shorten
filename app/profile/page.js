"use client";

import React, { useMemo } from 'react';
import AsideWrapper from "@/components/AsideWrapper";
import { useUrlStore } from "@/store/useUrlStore";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const { stats } = useUrlStore();

  const profile = useMemo(() => {
    const user = session?.user;
    return {
      name: user?.username || user?.name || '—',
      email: user?.email || '—',
      image: user?.image,
    };
  }, [session]);

  return (
    <AsideWrapper>
      <main className="w-full flex justify-end">
        <div className="w-[calc(100vw-180px)] md:w-[calc(100vw-180px)] lg:w-[calc(100vw-180px)] py-24 px-4 md:px-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                  {profile.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.image}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/60 font-semibold">{profile.name.slice(0, 1)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h1>
                  <p className="text-white/60 text-sm md:text-base">{profile.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs">Total URLs</p>
                  <p className="text-white font-bold text-lg">{stats?.totalUrls ?? 0}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs">Total Clicks</p>
                  <p className="text-white font-bold text-lg">{stats?.totalViews ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">Account</h2>
                <p className="text-white/60 text-sm mt-2">Manage your account details and access.</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">Shortening</h2>
                <p className="text-white/60 text-sm mt-2">Your generated links and performance metrics.</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">Analytics</h2>
                <p className="text-white/60 text-sm mt-2">Track clicks, engagement, and trends over time.</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5">
              <h2 className="text-white font-semibold text-lg">Profile Summary</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <p className="text-white/60 text-xs">Active Links</p>
                  <p className="text-white font-bold text-lg">{stats?.activeLinks ?? 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <p className="text-white/60 text-xs">Security</p>
                  <p className="text-white font-bold text-lg">Email OTP</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <p className="text-white/60 text-xs">Session</p>
                  <p className="text-white font-bold text-lg">{session ? 'Active' : 'Guest'}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                  <p className="text-white/60 text-xs">User Type</p>
                  <p className="text-white font-bold text-lg">—</p>
                </div>
              </div>
            </div>

            {!session && (
              <div className="mt-8 text-center rounded-2xl bg-red-500/10 border border-red-500/20 p-6">
                <p className="text-red-300 font-semibold">You are not signed in.</p>
                <p className="text-white/60 text-sm mt-1">Sign in to view your saved data.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AsideWrapper>
  );
};

export default ProfilePage;

