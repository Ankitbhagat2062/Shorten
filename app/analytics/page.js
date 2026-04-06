"use client";

import AsideWrapper from "@/components/AsideWrapper";
import { useSidebar } from "@/context/SidebarContext";
import { transformToSingleUrlData } from "@/lib/analyticsUtils";
import { dateRanges, timelineViews } from "@/lib/constants";
import { AnalyticsIcon, BarChart, BrowserIcon, CalendarIcon, ChevronDownIcon, ClockIcon, DeviceIcon, DonutChart, GlobeIcon, GoogleMapView, LineChart, LinkIcon, PlusIcon, ProfileIcon, ProgressBarChart, RefreshIcon, StatsCard, TrendUpIcon, UserIcon, WorldMap } from "@/lib/icons";
import { useUrlStore } from "@/store/useUrlStore";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

// Main Analytics Component
const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [activeChart, setActiveChart] = useState('hourly');
  const { deviceId, urlData, analyticsData, setSingleUrlData } = useUrlStore();
  const { isOpen } = useSidebar();
  // Data fetches here the first time.

  useEffect(() => {
    console.log(analyticsData ? 'Data fetched successfully' : 'Error fetching data');
  }, [deviceId])
  if (!analyticsData) {
    return (
      <>
        <AsideWrapper >
          <main className="w-full flex items-center justify-center min-h-screen">
            <div className="text-center p-8 animate-fade-in-up">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
                <AnalyticsIcon className="w-12 h-12 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-3">
                No Analytics Data Yet
              </h2>

              {/* Description */}
              <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                Create your first short URL to start tracking clicks and see your analytics here.
              </p>

              {/* CTA Button */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                Create Your First Short URL
              </Link>

              {/* Decorative elements */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
            </div>
          </main>
        </AsideWrapper>
      </>
    )
  }
  const getTimelineData = () => {
    switch (activeChart) {
      case 'hourly': return analyticsData.timelineData.hourly;
      case 'daily': return analyticsData.timelineData.daily;
      case 'weekly': return analyticsData.timelineData.weekly;
      case 'monthly': return analyticsData.timelineData.monthly;
      default: return analyticsData.timelineData.daily;
    }
  };
  const getTimelineLabel = () => {
    switch (activeChart) {
      case 'hourly': return 'hour';
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      default: return 'day';
    }
  };
  const handleRedirect = (url) => {
    const singleUrlData = transformToSingleUrlData(urlData, url.shortName);
    setSingleUrlData(singleUrlData);
    redirect(`/analytics/${url.shortName}`)
  }
  return (
    <AsideWrapper>
      {/* Main Content */}
      <main className={` flex justify-end items-center w-full`}>
        {/* Top Bar */}
        <header className={`glass fixed top-0 right-0 z-30 md:px-8 px-4 sm:py-4 pb-2 ${isOpen ? ' w-[calc(100vw-60px)] ' : 'w-[calc(100vw-180px)] '}`}>
          <div className={`flex justify-between ${isOpen ? 'items-center sm:flex-row flex-col gap-1' : ' md:items-center items-start md:flex-row flex-col gap-2'}`}>
            <div>
              <h1 className={`${isOpen ? 'text-2xl' : ''} font-bold text-white`}>Analytics</h1>
              <p className={`text-white/60 ${isOpen ? 'text-sm' : 'text-xs'}`}>Track your URL performance and user engagement</p>
            </div>
            <div className={`flex items-center ${isOpen ? 'gap-4 ' : 'gap-0.5'}`}>
              {/* Date Range Filter */}
              <div className="relative input-glass sm:px-4 !p-1">
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-8 ml-1 focus:outline-none sm:pl-5 focus-within:outline-none text-xs sm:text-sm appearance-none cursor-pointer max-w-45"
                >
                  {dateRanges.map((range) => (
                    <option key={range.id} value={range.id} className="bg-[#1a1a2e]">
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
              {/* Refresh Button */}
              <button className="sm:p-3 p-1 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                <RefreshIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Analytics Content */}
        <div className="md:p-8 p-4 space-y-8 mt-35 sm:mt-20 sm:w-[calc(100vw-180px)] w-[calc(100vw-60px)]">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={LinkIcon}
              title="Total Clicks"
              value={analyticsData.overview.totalClicks}
              change={12.5}
              changeType="positive"
              delay={100}
            />
            <StatsCard
              icon={UserIcon}
              title="Return Users"
              value={analyticsData.overview.returnUsers}
              change={8.3}
              changeType="positive"
              delay={200}
            />
            <StatsCard
              icon={ProfileIcon}
              title="Real Users"
              value={analyticsData.overview.realUsers}
              change={15.2}
              changeType="positive"
              delay={300}
            />
            <StatsCard
              icon={ClockIcon}
              title="Peak Visit Time"
              value={analyticsData.overview.peakTime}
              change={2.1}
              changeType="negative"
              delay={400}
              suffix=""
            />
          </div>

          {/* World Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Google Map */}
            <div className="lg:col-span-2 glass-card min-h-125 rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h2 className="text-sm sm:text-xl font-bold text-white flex items-center gap-2">
                  <GlobeIcon className="w-6 h-6 text-[#667eea]" />
                  User Locations
                </h2>
                <span className="text-center text-white/60 text-xs sm:text-sm">Real-time active users worldwide</span>
              </div>
              <GoogleMapView locations={analyticsData.userLocations} />
            </div>

            {/* Device Breakdown */}
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <h2 className="text-sm sm:text-xl font-bold text-white flex items-center gap-2 mb-6">
                <DeviceIcon className="w-6 h-6 text-[#667eea]" />
                Device Breakdown
              </h2>
              <div className="flex flex-col items-center">
                <DonutChart data={analyticsData.deviceBreakdown} size={180} />
                <div className="mt-6 space-y-3 w-full">
                  {analyticsData.deviceBreakdown.map((device, index) => (
                    <div
                      key={device.name}
                      className="flex items-center justify-between animate-fade-in-up"
                      style={{ animationDelay: `${700 + (index * 100)}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: device.color }}
                        />
                        <span className="text-white/80 text-sm">{device.name}</span>
                      </div>
                      <span className="text-white font-medium">{device.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Browser Stats & Top URLs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Browser Statistics */}
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <BrowserIcon className="w-6 h-6 text-[#667eea]" />
                Browser Usage
              </h2>
              <ProgressBarChart
                data={analyticsData.browserStats}
                delay={800}
              />
            </div>

            {/* Top Performing URLs */}
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="sm:text-xl font-bold text-white flex items-center gap-2 mb-6">
                <TrendUpIcon className="w-6 h-6 text-[#667eea]" />
                Top Performing URLs
              </h2>
              <div className="space-y-4">
                {analyticsData.topUrls.map((url, index) => (
                  <button type="button" onClick={() => handleRedirect(url)}
                    key={url.id}
                    className="flex w-full cursor-pointer items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${900 + (index * 100)}ms` }}
                  >
                    <span className="text-white/40 font-bold text-xl w-6">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#0a34ed] font-semibold truncate">{url.shortName}</span>
                        <span className="text-white font-medium">{url.clicks.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full"
                          style={{ width: `${(url.clicks / analyticsData.topUrls[0].clicks) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-900/40 text-xs">{url.uniqueUsers.toLocaleString()} users</span>
                        <span className="text-gray-900/40 text-xs">{url.conversion}% conversion</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Charts */}
          <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <div className="flex gap-2 sm:gap-0 flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="sm:text-xl font-bold text-white flex items-center gap-2">
                <AnalyticsIcon className="w-6 h-6 text-[#667eea]" />
                Click Activity
              </h2>
              <div className="flex items-center sm:gap-2">
                {timelineViews.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveChart(option.id)}
                    className={`
                      px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                      ${activeChart === option.id
                        ? 'bg-[#667eea] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type Selector */}
            <div className="mb-6">
              <LineChart
                data={getTimelineData()}
                dataKey="visits"
                color="#667eea"
                height={250}
                delay={1100}
                xKey={getTimelineLabel()}
              />
            </div>
          </div>

          {/* Peak Hours Bar Chart */}
          <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="sm:text-xl font-bold text-white flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-[#667eea]" />
                At What Time Users Visit Most
              </h2>
              <span className="text-white/60 text-sm">Click distribution by time of day</span>
            </div>
            <BarChart
              data={analyticsData.peakHours}
              height={200}
              delay={1300}
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1400ms' }}>
              <h3 className="text-white/60 text-sm font-medium mb-2">Most Active Country</h3>
              <p className="sm:text-2xl font-bold text-white">{analyticsData.overview.peakLocation.topCountry.name}</p>
              <p className="text-green-400 text-sm mt-1">↑ {analyticsData.overview.peakLocation.topCountry.percentage}% from last period</p>
            </div>
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1500ms' }}>
              <h3 className="text-white/60 text-sm font-medium mb-2">Peak Day</h3>
              <p className="sm:text-2xl font-bold text-white">{analyticsData.overview.peakDay}</p>
              <p className="text-white/60 text-sm mt-1">Highest traffic day</p>
            </div>
            <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1600ms' }}>
              <h3 className="text-white/60 text-sm font-medium mb-2">Avg. Session Duration</h3>
              <p className="sm:text-2xl font-bold text-white">4m 32s</p>
              <p className="text-green-400 text-sm mt-1">↑ 8.2% from last period</p>
            </div>
          </div>
        </div>
      </main>
    </AsideWrapper>
  );
};

export default Analytics;
