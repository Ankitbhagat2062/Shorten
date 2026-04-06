'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider } from "next-auth/react"
import { calculateStats, transformToAnalyticsData, transformToMockUrls } from "@/lib/analyticsUtils";
import { useUrlStore } from '@/store/useUrlStore';
import useSWR from 'swr';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { setAnalyticsData, setMockUrls, setFetchedData, setStats, setUrlData, setError, setIsLoading } = useUrlStore();
  const [deviceId, setDeviceId] = useState(null);
  useEffect(() => {
    const getId = () => {
      let newDeviceId;
      // Check if id is provided, otherwise get from localStorage or generate new UUID
      if (!newDeviceId) {
        newDeviceId = localStorage.getItem('deviceId');
        if (!newDeviceId) {
          // Generate new UUID
          newDeviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          localStorage.setItem('deviceId', newDeviceId);
        }
      }
      setDeviceId(newDeviceId);
    }
    getId()
  }, [])
  // Get the setter functions from your Zustand store
  const { data, error, isLoading } = useSWR(
    deviceId ? `/api/fetch-data/${deviceId}` : null,
    fetcher,
    {
      // Optional: keep showing old data while fetching new data
      keepPreviousData: true,
      // This ensures that even on a fresh page load/refresh, 
      // the store gets populated as soon as the data arrives
      onSuccess: (data) => {
        if (data.success && data.data) {
          updateZustandStore(data.data);
        }
      }
    }
  );
  // Helper function to handle all your transformations
  const updateZustandStore = (rawData) => {
    setUrlData(rawData);
    setStats(calculateStats(rawData));
    setMockUrls(transformToMockUrls(rawData));
    setAnalyticsData(transformToAnalyticsData(rawData));
  };
  useEffect(() => {
    if (data?.success && data?.data) {
      setUrlData(data.data);
      // Transform and store stats
      const calculatedStats = calculateStats(data.data);
      setStats(calculatedStats);

      // Transform and store URLs list
      const urls = transformToMockUrls(data.data);
      setMockUrls(urls);

      // Transform and store analytics data
      const analyticsData = transformToAnalyticsData(data.data);
      setAnalyticsData(analyticsData);
    }
    setFetchedData(data);
    setIsLoading(isLoading);
    setError(error);
  }, [data])

  return (
    <SessionProvider >
      <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
        {children}
      </SidebarContext.Provider>
    </SessionProvider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
