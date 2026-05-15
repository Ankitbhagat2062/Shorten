'use client';

import React, { useMemo } from 'react';
import AsideWrapper from "@/components/AsideWrapper";
import { useSession, signOut } from "next-auth/react";
import { redirect } from 'next/navigation';

const SettingsPage = () => {
  const { data: session } = useSession();

  const profile = useMemo(() => {
    const user = session?.user;
    return {
      name: user?.username || user?.name || '—',
      email: user?.email || '—',
      image: user?.image || null,
    };
  }, [session]);

  if (!session) {
    return (
      <AsideWrapper>
        <main className="w-full flex justify-end">
          <div className="w-[calc(100vw-180px)] md:w-[calc(100vw-180px)] lg:w-[calc(100vw-180px)] py-24 px-4 md:px-6">
            <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
                  <p className="text-white/60 text-sm md:text-base mt-1">
                    Sign in to manage your preferences and account security.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                <p className="text-red-300 font-semibold">You are not signed in.</p>
                <p className="text-white/60 text-sm mt-1">
                  Create an account to save and securely manage your settings.
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => redirect('/register')}
                    className="btn-secondary px-6 py-3 flex items-center justify-center"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AsideWrapper>
    );
  }

  return (
    <AsideWrapper>
      <main className="w-full flex justify-end">
        <div className="w-[calc(100vw-180px)] md:w-[calc(100vw-180px)] lg:w-[calc(100vw-180px)] py-24 px-4 md:px-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
                <p className="text-white/60 text-sm md:text-base mt-1">
                  Manage your preferences and account security.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="btn-primary px-4 py-2 flex items-center justify-center"
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Sections */}
            <div className="mt-8 space-y-6">
              {/* General */}
              <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">General</h2>
                <p className="text-white/60 text-sm mt-2">
                  Basic app preferences.
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-medium">Theme</p>
                        <p className="text-white/60 text-sm mt-1">
                          Coming soon (Light/Dark/Auto).
                        </p>
                      </div>
                      <span className="text-white/40 text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        Soon
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-medium">Notifications</p>
                        <p className="text-white/60 text-sm mt-1">
                          Enable email alerts for key events.
                        </p>
                      </div>
                      <span className="text-white/40 text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        Soon
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account */}
              <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">Account</h2>
                <p className="text-white/60 text-sm mt-2">
                  Update identity and personal details.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-black/20 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-white/60 text-sm">Name</p>
                      <p className="text-white font-semibold mt-1">{profile.name}</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="rounded-xl bg-black/20 border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-white/60 text-sm">Email</p>
                      <p className="text-white font-semibold mt-1">{profile.email}</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm"
                    >
                      Verify / Change
                    </button>
                  </div>
                </div>
              </section>

              {/* Security */}
              <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-white font-semibold">Security</h2>
                <p className="text-white/60 text-sm mt-2">
                  Improve account safety.
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <p className="text-white font-medium">Password</p>
                    <p className="text-white/60 text-sm mt-1">
                      Reset your password.
                    </p>
                    <button
                      type="button"
                      className="mt-3 px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm"
                    >
                      Update password
                    </button>
                  </div>

                  <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <p className="text-white font-medium">Email OTP</p>
                    <p className="text-white/60 text-sm mt-1">
                      Add OTP verification for sensitive actions.
                    </p>
                    <button
                      type="button"
                      className="mt-3 px-4 py-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm"
                    >
                      Configure OTP
                    </button>
                  </div>
                </div>
              </section>

              {/* Danger zone */}
              <section className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
                <h2 className="text-red-300 font-semibold">Danger zone</h2>
                <p className="text-white/60 text-sm mt-2">
                  These actions can’t be undone.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                  >
                    Sign out
                  </button>

                  <button
                    type="button"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors font-semibold"
                  >
                    Delete account (soon)
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </AsideWrapper>
  );
};

export default SettingsPage;

