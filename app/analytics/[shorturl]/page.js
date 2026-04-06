"use client";

import Loading from "@/components/Loading";
import NoData from "@/components/NoData";
import { transformToSingleUrlData } from "@/lib/analyticsUtils";
import { dateRanges, tabs, timelineViews } from "@/lib/constants";
import { ArrowLeftIcon, BrowserIcon, CalendarIcon, ChevronDownIcon, ClockIcon, DeviceIcon, DonutChart, DownloadIcon, GlobeIcon, HomeIcon, LineChart, LinkIcon, ProgressBarChart, RefreshIcon, StatsCard, TableIcon, TargetIcon, TrendDownIcon, TrendUpIcon, UrlInfoCard, UserIcon, XIcon } from "@/lib/icons";
import { useUrlStore } from "@/store/useUrlStore";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";

// Single URL Analytics Page
const SingleUrlAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [timelineView, setTimelineView] = useState('daily');
  const [isExporting, setIsExporting] = useState(false);
  const { singleUrlData, urlData, isLoading, setSingleUrlData } = useUrlStore();
  const [countdown, setCountdown] = useState(5);
  const params = useParams();
  const shortCode = params.shorturl

  // Hook for transforming URL data
  useEffect(() => {
    const singleUrldata = transformToSingleUrlData(urlData, shortCode);
    setSingleUrlData(singleUrldata);
  }, [urlData, shortCode, setSingleUrlData])


  const { urlInfo, stats, geographicData, deviceData, referrerData, timelineData, conversionData, clickHistory } = singleUrlData;
  const shorturlname = urlInfo.shortUrl.split('/')[3]
  // Hook for countdown timer and redirect
  useEffect(() => {
    if (shortCode !== shorturlname) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            redirect('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);
  // handleExport must be defined as a hook (useCallback) - it must be called unconditionally
  const handleExport = useCallback(() => {
    setIsExporting(true);
    // Simulate export - only runs if we have data
    if (!singleUrlData || isLoading) return;

    const { urlInfo, stats, geographicData, deviceData, referrerData, conversionData } = singleUrlData;

    setTimeout(() => {
      const exportData = {
        urlInfo,
        stats,
        geographicData,
        deviceData,
        referrerData,
        conversionData,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${urlInfo.shortUrl.split('/').pop()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 1000);
  }, [singleUrlData, isLoading]);

  // Early return checks after all hooks
  if (!singleUrlData) return <NoData />
  if (isLoading) return <Loading />
  if (shortCode !== shorturlname) {

    return (
      <main className="w-full flex items-center justify-center min-h-screen gradient-bg">
        <div className="text-center p-8 animate-fade-in-up max-w-md mx-4">
          {/* Error Icon with Animation */}
          <div className="relative mb-8">
            <div className="w-28 h-28 mx-auto rounded-full bg-linear-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shadow-lg shadow-red-500/20 animate-pulse">
              <XIcon className="w-14 h-14 text-red-400" />
            </div>
            {/* Decorative rings */}
            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-4 w-36 h-36 mx-auto rounded-full border border-red-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-3">
            URL Not Found
          </h2>

          {/* Description */}
          <p className="text-white/60 text-lg mb-4">
            The short URL <span className="text-red-400 font-semibold">"{shortCode}"</span> does not exist or has been removed.
          </p>
          <p className="text-white/40 text-sm mb-8">
            It may have been deleted or the link is incorrect.
          </p>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-white/50 text-sm mb-2">Redirecting you to home page in</p>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4">
              <span className="text-2xl font-bold text-white">{countdown}</span>
            </div>
            <p className="text-white/40 text-xs">seconds</p>
          </div>

          {/* CTA Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <HomeIcon className="w-5 h-5" />
            Create a Short URL Now
          </Link>

          {/* Decorative elements */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </main>
    );
  }

  const getTimelineData = () => {
    switch (timelineView) {
      case 'hourly': return timelineData.hourly;
      case 'daily': return timelineData.daily;
      case 'weekly': return timelineData.weekly;
      case 'monthly': return timelineData.monthly;
      default: return timelineData.daily;
    }
  };

  const getTimelineLabel = () => {
    switch (timelineView) {
      case 'hourly': return 'hour';
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      default: return 'day';
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-30 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 justify-between max-w-7xl mx-auto">
          <div className="flex justify-between w-full items-center sm:gap-4">
            <Link
              href="/analytics"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Analytics</span>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-xl font-bold text-white">URL Analytics</h1>
              <p className="text-white/60 text-sm">{urlInfo.shortUrl}</p>
            </div>
          </div>
          <div className="flex justify-between w-full items-center gap-3">
            {/* Date Range Filter */}
            <div className="input-glass !p-2.5 relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className=" pl-5 text-xs w-full focus:outline-none focus-within:outline-none sm:text-sm appearance-none cursor-pointer min-w-20"
              >
                {dateRanges.map((range) => (
                  <option key={range.id} value={range.id} className="bg-[#1a1a2e]">
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
            </div>
            <div className="btn flex justify-center items-center gap-2">
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#667eea] text-white font-medium hover:bg-[#764ba2] transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <RefreshIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <DownloadIcon className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
              {/* Refresh Button */}
              <button className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                <RefreshIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* URL Info Card */}
        <UrlInfoCard urlInfo={urlInfo} delay={100} />

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard
            icon={LinkIcon}
            title="Total Clicks"
            value={stats.totalClicks}
            change={12.5}
            changeType="positive"
            delay={200}
          />
          <StatsCard
            icon={UserIcon}
            title="Unique Visitors"
            value={stats.uniqueVisitors}
            change={8.3}
            changeType="positive"
            delay={300}
          />
          <StatsCard
            icon={RefreshIcon}
            title="Return Visitors"
            value={stats.returnVisitors}
            change={5.2}
            changeType="positive"
            delay={400}
          />
          <StatsCard
            icon={TrendDownIcon}
            title="Bounce Rate"
            value={stats.bounceRate}
            change={2.1}
            changeType="negative"
            delay={600}
            suffix="%"
          />
          <StatsCard
            icon={ClockIcon}
            title="Avg. Session"
            value={stats.avgSessionDuration}
            change={0}
            changeType="positive"
            delay={700}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="glass-card rounded-2xl p-2 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-[#667eea] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline Chart */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-[#667eea]" />
                  Click Activity
                </h2>
                <div className="flex items-center gap-1">
                  {timelineViews.map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setTimelineView(view.id)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${timelineView === view.id
                          ? 'bg-[#667eea] text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>
              <LineChart
                data={getTimelineData()}
                dataKey="visits"
                color="#667eea"
                height={250}
                delay={900}
                xKey={getTimelineLabel()}
              />
            </div>

            {/* Top Countries */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <GlobeIcon className="w-6 h-6 text-[#667eea]" />
                Top Countries
              </h2>
              <div className="space-y-3">
                {geographicData.slice(0, 5).map((location, index) => (
                  <div
                    key={location.countryCode}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${1100 + (index * 100)}ms` }}
                  >
                    <span className="text-2xl">{location.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium truncate">{location.country}</span>
                        <span className="text-white font-semibold">{location.clicks.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white/60 text-sm w-12 text-right">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <DeviceIcon className="w-6 h-6 text-[#667eea]" />
                Device Breakdown
              </h2>
              <div className="flex items-center justify-center">
                <DonutChart data={deviceData.os} size={180} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {deviceData.os.map((os, index) => (
                  <div
                    key={os.name}
                    className="flex items-center gap-2 animate-fade-in-up"
                    style={{ animationDelay: `${1300 + (index * 100)}ms` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: os.color }}
                    />
                    <span className="text-white/80 text-sm">{os.name}</span>
                    <span className="text-white font-medium ml-auto">{os.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Stats */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '1400ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <BrowserIcon className="w-6 h-6 text-[#667eea]" />
                Browser Usage
              </h2>
              <ProgressBarChart
                data={deviceData.browsers}
                delay={1500}
              />
            </div>
          </div>
        )}

        {activeTab === 'geography' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Full Map View */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="sm:text-xl font-bold text-white flex items-center gap-2 mb-6">
                <GlobeIcon className="w-6 h-6 text-[#667eea]" />
                Geographic Distribution
              </h2>
              <div className="bg-[#1a1a2e] rounded-xl p-8 min-h-80 flex items-center justify-center">
                <div className="text-center">
                  <GlobeIcon className="w-24 h-24 text-[#667eea]/30 mx-auto mb-4" />
                  <p className="text-white/60">Interactive map visualization</p>
                  <p className="text-white/40 text-sm">{geographicData.length} countries tracked</p>
                </div>
              </div>
            </div>

            {/* Country List */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
              <h2 className="text-xl font-bold text-white mb-6">All Countries</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {geographicData.map((location, index) => (
                  <div
                    key={location.countryCode}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xl w-8">{location.flag}</span>
                    <span className="text-white flex-1">{location.country}</span>
                    <span className="text-white/80 text-sm">{location.clicks.toLocaleString()}</span>
                    <span className="text-white/60 text-xs w-12 text-right">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OS Breakdown */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <DeviceIcon className="w-6 h-6 text-[#667eea]" />
                Operating Systems
              </h2>
              <div className="flex items-center justify-center mb-6">
                <DonutChart data={deviceData.os} size={200} />
              </div>
              <ProgressBarChart data={deviceData.os} delay={900} />
            </div>

            {/* Browser Breakdown */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <BrowserIcon className="w-6 h-6 text-[#667eea]" />
                Browsers
              </h2>
              <div className="flex items-center justify-center mb-6">
                <DonutChart data={deviceData.browsers} size={200} />
              </div>
              <ProgressBarChart data={deviceData.browsers} delay={1100} />
            </div>
          </div>
        )}

        {activeTab === 'referrers' && (
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <LinkIcon className="w-6 h-6 text-[#667eea]" />
              Referrer Sources
            </h2>
            <div className="space-y-3">
              {referrerData.map((referrer, index) => (
                <div
                  key={referrer.source}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${900 + (index * 100)}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#667eea]/20 flex items-center justify-center">
                    <span className="text-2xl">{referrer.source.includes('Google') ? '🔍' : referrer.source.includes('Facebook') ? '📘' : referrer.source.includes('Twitter') ? '🐦' : referrer.source.includes('Email') ? '📧' : referrer.source.includes('LinkedIn') ? '💼' : referrer.source.includes('Instagram') ? '📷' : referrer.source.includes('Reddit') ? '🔴' : '🔗'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{referrer.source}</span>
                      <span className="text-white font-semibold">{referrer.clicks.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full"
                        style={{ width: `${referrer.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white/60 text-sm w-16 text-right">{referrer.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Timeline Controls */}
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-[#667eea]" />
                Click Activity Over Time
              </h2>
              <div className="flex items-center gap-2">
                {timelineViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setTimelineView(view.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${timelineView === view.id
                        ? 'bg-[#667eea] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <LineChart
                data={getTimelineData()}
                dataKey="visits"
                color="#667eea"
                height={300}
                delay={900}
                xKey={getTimelineLabel()}
              />
            </div>

            {/* Timeline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                <h3 className="text-white/60 text-sm font-medium mb-2">Peak {getTimelineLabel().charAt(0).toUpperCase() + getTimelineLabel().slice(1)}</h3>
                <p className="text-2xl font-bold text-white">
                  {timelineView === 'hourly' ? '2 PM' : timelineView === 'daily' ? 'Wednesday' : 'Week 3'}
                </p>
                <p className="text-green-400 text-sm mt-1">↑ 23% above average</p>
              </div>
              <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
                <h3 className="text-white/60 text-sm font-medium mb-2">Lowest {getTimelineLabel().charAt(0).toUpperCase() + getTimelineLabel().slice(1)}</h3>
                <p className="text-2xl font-bold text-white">
                  {timelineView === 'hourly' ? '4 AM' : timelineView === 'daily' ? 'Sunday' : 'Week 1'}
                </p>
                <p className="text-red-400 text-sm mt-1">↓ 45% below average</p>
              </div>
              <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
                <h3 className="text-white/60 text-sm font-medium mb-2">Average per {getTimelineLabel()}</h3>
                <p className="text-2xl font-bold text-white">{(stats.totalClicks / 30).toFixed(0)}</p>
                <p className="text-white/60 text-sm mt-1">clicks per day</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Clicks Table */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '1500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TableIcon className="w-6 h-6 text-[#667eea]" />
              Recent Clicks
            </h2>
            <button className="text-[#667eea] text-sm font-medium hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/60 text-xs font-medium py-3 px-4">Time</th>
                  <th className="text-left text-white/60 text-xs font-medium py-3 px-4">Country</th>
                  <th className="text-left text-white/60 text-xs font-medium py-3 px-4">Device</th>
                  <th className="text-left text-white/60 text-xs font-medium py-3 px-4">Browser</th>
                  <th className="text-left text-white/60 text-xs font-medium py-3 px-4">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {clickHistory.map((click, index) => (
                  <tr
                    key={click.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-white/80 text-sm">
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2">
                        <span>{geographicData.find(g => g.countryCode === click.country)?.flag || '🌍'}</span>
                        <span className="text-white/80 text-sm">{click.country}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80 text-sm">{click.device}</td>
                    <td className="py-3 px-4 text-white/80 text-sm">{click.browser}</td>
                    <td className="py-3 px-4 text-white/80 text-sm">{click.referrer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleUrlAnalytics;
