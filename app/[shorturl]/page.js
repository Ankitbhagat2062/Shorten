"use client"

import Loading from '@/components/Loading';
import { useUrlStore } from '@/store/useUrlStore';
import { redirect, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'

const ShortUrl = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [urlData, setUrlData] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showUrl, setShowUrl] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [progress, setProgress] = useState(0)
  const params = useParams();
  const shortenedUrl = params.shorturl;
  const { originalUrl } = useUrlStore();
  useEffect(() => {
    const trackData = async (body) => {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(res => res.json())
        .then(data => {
          console.log(data?.success)
        });
    }
    const getLocation = () => {
      return new Promise((resolve) => {
        // Use the referrerData from state (set by useEffect)
        const referer = referrerData.rawReferrer
        const platform = referrerData.platform
        let location;
        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('userId', userId);
        }
        // Track
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // const res = await fetch(`/external-api/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const res = await fetch(`/api/geocode`);

            if (!res.ok) {
              const text = await res.text();
              console.error("Server returned non-OK status:", res.status, text);
              resolve({ location: null, userId, referer, platform });
              return;
            }

            const data = await res.json();
            console.log("Location found:", data.location);
            // Extract the fields you need
            location = {
              city: data?.city || data?.locality,
              region: data?.region_name, // State/Province
              country: data?.country_name,
              country_code: data.country_code,
              flag: {
                country_flag: data.location.country_flag,
                country_flag_emoji: data.location.country_flag_emoji,
                country_flag_emoji_unicode: data.location.country_flag_emoji_unicode,
              },
              latitude,
              longitude
            };

            console.log("Location resolved:", location);
            resolve({ location, userId, referer, platform });
          } catch (error) {
            console.error("Geocoding failed:", error);
            resolve({ location: null, userId, referer, platform });
          }
        },
          (error) => {
            console.error('Geolocation error:', error);
            // Still track without location
            resolve({ location: null, userId, referer, platform });
          }
        );
      });
    }
    const sendData = async () => {
      await fetch(`/api/resolve/${shortenedUrl}`)
        .then(res => res.json())
        .then(async (data) => {
          if (data.success) {
            // First get location (await for it to complete)
            const locationData = await getLocation();
            
            // Now track data AFTER getLocation has completed
            const device = navigator.userAgent;
            const timestamp = Date.now();
            const body = { 
              shortenedUrl, 
              location: locationData.location, 
              device, 
              timestamp, 
              userId: locationData.userId, 
              referer: locationData.referer, 
              platform: locationData.platform 
            };
            trackData(body);
            
            setUrlData(data);
            // Redirect after 3 seconds
            setTimeout(() => {
              redirect(data.originalUrl);
            }, 5000);
          } else {
            setUrlData(null);
            setIsNotFound(true);
          }
          setIsLoading(false);
        });
    }
    sendData()
  }, [urlData, shortenedUrl]);

  const getReferer = () => {
    if (typeof document === 'undefined') {
      console.log('document is undefined')
      return { rawReferrer: 'Direct', platform: 'Other' };
    }

    const rawReferrer = document.referrer || 'Direct';
    // console.log('document ', document.referrer)

    // Simple platform identification logic
    let platform = 'Other';
    if (rawReferrer.includes('youtube.com') || rawReferrer.includes('youtu.be')) platform = 'YouTube';
    else if (rawReferrer.includes('facebook.com') || rawReferrer.includes('l.facebook.com')) platform = 'Facebook';
    else if (rawReferrer.includes('t.co') || rawReferrer.includes('x.com')) platform = 'X (Twitter)';
    else if (rawReferrer.includes('instagram.com')) platform = 'Instagram';
    else if (rawReferrer === 'Direct') platform = 'Direct/None';

    return { rawReferrer, platform };
  };

  const [referrerData, setReferrerData] = useState({ rawReferrer: 'Direct', platform: 'Other' });

  useEffect(() => {
    const data = getReferer();
    setReferrerData(data);
  }, []);

  // Mock data - in real app, this would come from params and API
  const shortUrlData = {
    shortCode: params?.shorturl || 'abc123',
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${params?.shorturl || 'abc123'}`,
    originalUrl: urlData ? urlData.originalUrl : originalUrl,
    isSafe: true,
    title: referrerData.platform
  }

  useEffect(() => {
    if (isNotFound) {
      const timer = setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_BASE_URL;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNotFound]);

  useEffect(() => {
    // Countdown timer and progress bar animation
    if (urlData && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLoading(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => {
        clearInterval(timer);
        clearInterval(progressTimer);
      };
    }
  }, [urlData, countdown]);

  useEffect(() => {
    if (countdown === 0 && urlData) {
      redirect(shortUrlData.originalUrl);
    }
  }, [countdown, urlData]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!urlData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.88-5.812-2.34a8.003 8.003 0 01-1.812-2.34M12 9v3m0 3h.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">URL Not Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The shortened URL you are looking for does not exist.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to the homepage in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  const handleSkip = () => {
    // In real app, this would redirect to originalUrl
    redirect(shortUrlData.originalUrl)
  }

  const handleContinue = () => {
    setIsLoading(false)
  }

  const toggleUrlVisibility = () => {
    setShowUrl(!showUrl)
  }

  const maskUrl = (url) => {
    if (url.length <= 40) return url
    return url.substring(0, 25) + '...' + url.substring(url.length - 15)
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">

        {/* Logo */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold gradient-text">Shorten</h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="w-full max-w-md animate-fade-in-up delay-100">
            {/* Progress Bar */}
            <div className="h-2 bg-white/20 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Loading Animation */}
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-white/10 animate-pulse-glow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{countdown}</span>
                </div>
              </div>

              <h2 className="text-white text-xl font-semibold mb-2">
                Redirecting you...
              </h2>
              <p className="text-white/70 text-sm">
                You&apos;ll be automatically redirected in {countdown} seconds
              </p>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="mt-6 w-full btn-primary text-white py-3 px-6 rounded-xl font-semibold"
            >
              Skip & Continue Now →
            </button>
          </div>
        )}

        {/* URL Preview Card (shown after loading) */}
        {!isLoading && (
          <div className="w-full max-w-md animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6">
              {/* Header with safety indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    {shortUrlData.isSafe ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Safety Status</p>
                    <p className="text-green-400 font-semibold text-sm">
                      {shortUrlData.isSafe ? 'Safe & Verified' : 'Potentially Unsafe'}
                    </p>
                  </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 rounded-full">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-blue-400 text-xs font-medium">Private</span>
                </div>
              </div>

              {/* Short URL */}
              <div className="mb-4">
                <p className="text-white/50 text-xs mb-1">Short Link</p>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-white font-medium">{shortUrlData.shortUrl}</span>
                </div>
              </div>

              {/* Destination URL */}
              <div className="mb-6">
                <p className="text-white/50 text-xs mb-1">Destination</p>
                <div className="bg-white/10 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-white truncate">
                        {showUrl ? shortUrlData.originalUrl : maskUrl(shortUrlData.originalUrl)}
                      </span>
                    </div>
                    <button
                      onClick={toggleUrlVisibility}
                      className="ml-2 text-white/60 hover:text-white transition-colors shrink-0"
                    >
                      {showUrl ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Taking you to message */}
              <div className="text-center mb-6">
                <p className="text-white/70">
                  Taking you to: <span className="text-white font-medium">{shortUrlData.title}</span>
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full btn-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>Continue to Website</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional Ad Space */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center animate-fade-in-up delay-200">
            <p className="text-white/50 text-xs mb-2">Advertisement</p>
            <div className="h-16 flex items-center justify-center">
              <p className="text-white/40 text-sm">Your Ad Space Here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-white/60 text-sm">Powered by</span>
            <span className="gradient-text font-semibold">Shorten</span>
          </div>
          <p className="text-white/40 text-xs">
            Secure & Private URL Shortening
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ShortUrl
