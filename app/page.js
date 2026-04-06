'use client'
import Navbar from "@/components/Navbar";
import Form from "@/components/Form";
import { useUrlStore } from "@/store/useUrlStore";
import { useEffect } from "react";
import Link from "next/link";
export default function Home() {
  // Zustand store actions
  const { deviceId, setDeviceId } = useUrlStore();
  // Get deviceId from localStorage or generate one
  useEffect(() => {
    setDeviceId();
  }, [deviceId]);

  return (
    <div className="min-h-screen gradient-bg">

      <Navbar />
      {/* Hero Section */}
      <section className="pt-20 sm:pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Shorten Your URLs.{' '}
            <span className="gradient-text brightness-150">Simplify Your Links.</span>
          </h1>
          <p className="text-sm sm:text-xl text-white/80 mb-12 animate-fade-in-up delay-100">
            Create short, memorable links in seconds. Track clicks, analyze engagement, and grow your brand with Shorten.
          </p>
          <Form button={'Shorten'} />
        </div>
      </section>

      {/* Registration Banner */}
      <section className="py-12 px-4">
        <div className="max-w-4xl md:w-2xl mx-auto">
          <div className="glass-card flex flex-col rounded-2xl p-8 text-center animate-fade-in-up delay-300">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-white mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h2 className="text-2xl font-bold text-white">Register to Save Your Data</h2>
            </div>
            <p className="text-white/80 text-lg">
              Never lose your shortened URLs when switching devices. Create a free account today!
            </p>
            <Link href={'/register'} className="btn-primary py-2 px-4 mt-6">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4 animate-fade-in-up">
            Why Choose <span className="gradient-text">Shorten</span>?
          </h2>
          <p className="text-white/70 text-center text-lg mb-16 animate-fade-in-up delay-100">
            Everything you need to manage your links effectively
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: No Registration Required */}
            <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up delay-200">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No Registration Required</h3>
              <p className="text-white/70">
                Start shortening URLs instantly without creating an account. Just paste and go!
              </p>
            </div>

            {/* Feature 2: Analytics */}
            <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up delay-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Powerful Analytics</h3>
              <p className="text-white/70">
                Track clicks, geographic data, and engagement metrics for all your shortened links.
              </p>
            </div>

            {/* Feature 3: Fast & Secure */}
            <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up delay-400">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Fast & Secure</h3>
              <p className="text-white/70">
                Lightning-fast redirects with enterprise-grade security. Your links are safe with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Brand */}
          <div>
            <Link href={'/'} className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">Shorten</span>
            </Link>
            <p className="text-white/70 mt-4">
              Make your links shorter, smarter, and more shareable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 justify-center items-center justify-items-center py-4 grid-cols-1 sm:grid-cols-2 gap-8 mb-8">

            {/* Product Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              © {new Date().getFullYear()} Shorten. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
