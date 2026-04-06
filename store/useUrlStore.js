// store/useUrlStore.js
import { calculateStats, transformToMockUrls, transformToAnalyticsData } from '@/lib/analyticsUtils';
import { create } from 'zustand';

export const useUrlStore = create((set, get) => ({
  // Raw data from MongoDB
  urlData: null,

  // Transformed data for analytics
  stats: { totalUrls: 0, totalViews: 0, activeLinks: 0 },
  mockUrls: [],
  analyticsData: null,
  singleUrlData: null,
  deviceId: null,
  fetchedData:null,
  // Loading and error states
  isLoading: false,
  error: null,

  // Current selected URL for detailed view
  currentShortenedUrl: null,
  originalUrl: "",

  // Actions
  setOriginalUrl: (url) => set({ originalUrl: url }),

  setDeviceId: () => {
    // Check if id is provided, otherwise get from localStorage or generate new UUID
    let newDeviceId;
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
    set({ deviceId: newDeviceId });
  },

  setFetchedData: (data) => set({ fetchedData: data }),

  setUrlData: (data) => set({ urlData: data }),

  setStats: (stats) => set({ stats }),

  setMockUrls: (urls) => set({ mockUrls: urls }),

  setAnalyticsData: (data) => set({ analyticsData: data }),

  setSingleUrlData: (data) => set({ singleUrlData: data }),

  setCurrentShortenedUrl: (url) => set({ currentShortenedUrl: url }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  handleFetch: async (deviceId) => {
    const { setUrlData, setStats, setMockUrls, setAnalyticsData } = get()
    let url = `api/fetch-data/${deviceId}`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    // Data fetches here the first time.

    const data = await response.json();
    if (data.success && data.data) {
      // console.log('hello', data)
      // Store raw datayes

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
  },
  // Clear all data
  clearData: () => set({
    urlData: null,
    stats: { totalUrls: 0, totalViews: 0, activeLinks: 0 },
    mockUrls: [],
    analyticsData: null,
    singleUrlData: null,
    currentShortenedUrl: null,
    isLoading: false,
    error: null
  }),
}));
