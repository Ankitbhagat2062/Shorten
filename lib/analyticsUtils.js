/**
 * Utility functions to transform MongoDB data into analytics format
 */

// Helper to extract device type from user agent
const getDeviceType = (userAgent) => {
    if (!userAgent) return 'Other';
    const ua = userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return 'Mobile';
    if (/macintosh|windows|linux/i.test(ua)) return 'Desktop';
    return 'Other';
};

// Helper to extract browser from user agent
const getBrowser = (userAgent) => {
    if (!userAgent) return 'Other';
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('edge')) return 'Edge';
    return 'Other';
};

// Helper to extract OS from user agent
const getOS = (userAgent) => {
    if (!userAgent) return 'Other';
    const ua = userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'Mac';
    if (ua.includes('linux')) return 'Linux';
    return 'Other';
};

// Helper to format date
const formatDate = (date) => {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'string') return date.split('T')[0];
    if (date.$date) return new Date(date.$date).toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
};

const getCountryStats = (visits) => {
    if (!visits || visits.length === 0) return [];

    // Group visits by country
    const countryMap = {};

    visits.forEach(visit => {
        if (!visit.location || !visit.location.country) return;

        const countryName = visit.location.country;
        const countryCode = visit.location.country_code || countryName.substring(0, 2).toUpperCase();
        if (!countryMap[countryName]) {
            countryMap[countryName] = {
                country: countryName,
                countryCode: countryCode,
                clicks: 0,
                lat: visit.location.latitude || 0,
                lng: visit.location.longitude || 0
            };
        }

        countryMap[countryName].clicks += 1;
    });

    // Convert to array and sort by clicks descending
    return Object.values(countryMap).sort((a, b) => b.clicks - a.clicks);
};
// Transform MongoDB URL data to mockUrls format
export const transformToMockUrls = (mongoData) => {
    if (!mongoData || !mongoData.totalUrls) return [];

    return mongoData.totalUrls.map((url, index) => {
        const totalClicks = url.clicks ? url.clicks.reduce((sum, click) => sum + (click.visits?.length || 0), 0) : 0;

        return {
            id: index + 1,
            shortName: url.shortenedUrl,
            originalUrl: url.originalUrl,
            clicks: totalClicks,
            createdDate: formatDate(url.createdDate),
            status: url.isActive ? 'active' : 'inactive',
        };
    });
};

// Calculate stats from MongoDB data
export const calculateStats = (mongoData) => {
    if (!mongoData || !mongoData.totalUrls) {
        return { totalUrls: 0, totalViews: 0, activeLinks: 0 };
    }

    const totalUrls = mongoData.totalUrls.length;
    let totalViews = 0;
    let activeLinks = 0;

    mongoData.totalUrls.forEach(url => {
        if (url.clicks) {
            url.clicks.forEach(click => {
                totalViews += click.visits?.length || 0;
            });
        }
        if (url.isActive) activeLinks++;
    });

    return { totalUrls, totalViews, activeLinks };
};

// Transform to analytics data
export const transformToAnalyticsData = (mongoData) => {
    if (!mongoData || !mongoData.totalUrls) {
        return getDefaultAnalyticsData();
    }

    // Collect all visits
    const totalUrls = [];
    const allClicks = [];
    const allVisits = [];
    const deviceStats = {};
    const browserStats = {};
    const osStats = {};
    const hourlyData = {};
    const dailyData = {};

    mongoData.totalUrls.forEach(url => {
        totalUrls.push(url)
        if (url.clicks) {
            url.clicks.forEach(click => {
                allClicks.push(click);
                click.visits?.forEach(visit => {
                    allVisits.push(visit);

                    // Device breakdown
                    const device = getDeviceType(visit.device);
                    deviceStats[device] = (deviceStats[device] || 0) + 1;

                    // Browser stats
                    const browser = getBrowser(visit.device);
                    browserStats[browser] = (browserStats[browser] || 0) + 1;

                    // OS stats
                    const os = getOS(visit.device);
                    osStats[os] = (osStats[os] || 0) + 1;
                    // const country = 
                    // Hourly data
                    if (visit.timestamp) {
                        const timestamp = new Date(visit.timestamp.$date || visit.timestamp);
                        const hour = timestamp.getHours();
                        hourlyData[hour] = (hourlyData[hour] || 0) + 1;

                        const day = timestamp.getDay();
                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        dailyData[dayNames[day]] = (dailyData[dayNames[day]] || 0) + 1;
                    }
                });
            });
        }
    });

    // Calculate return users - clicks that have more than 1 visit
    let returnUsers = 0;
    allClicks.forEach(user => {
        if (user.visits.length > 1) {
            returnUsers += 1;
        }
    });

    // Find peak hour
    let peakHour = 0;
    let maxHourly = 0;
    Object.entries(hourlyData).forEach(([hour, count]) => {
        if (count > maxHourly) {
            maxHourly = count;
            peakHour = parseInt(hour);
        }
    });

    // Find peak day
    let peakDay = 'Monday';
    let maxDaily = 0;
    Object.entries(dailyData).forEach(([day, count]) => {
        if (count > maxDaily) {
            maxDaily = count;
            peakDay = day;
        }
    });

    const totalClicks = allVisits.length;

    // Format device breakdown
    const deviceBreakdown = Object.entries(deviceStats).map(([name, value]) => ({
        name,
        value: Math.round((value / totalClicks) * 100),
        color: getColorForDevice(name)
    }));

    // Format browser stats
    const browserStatsFormatted = Object.entries(browserStats).map(([name, value]) => ({
        name,
        value: Math.round((value / totalClicks) * 100),
        color: getColorForBrowser(name)
    }));

    // Generate timeline data
    const timelineData = {
        hourly: generateHourlyData(allClicks),
        daily: generateDailyData(allClicks),
        weekly: generateWeeklyData(allClicks),
        monthly: generateMonthlyData(allClicks)
    };

    // Format top URLs
    const topUrls = transformToMockUrls(mongoData)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
        .map((url, index) => ({
            ...url,
            uniqueUsers: Math.floor(url.clicks * 0.7),
            conversion: (Math.random() * 3 + 1).toFixed(1)
        }));

    // Generate peak hours data
    const peakHours = generatePeakHours(hourlyData);
    const peakLocation = findTopLocationWithPercentage(allClicks)
    return {
        overview: {
            totalClicks,
            returnUsers: Math.max(0, returnUsers),
            realUsers: allClicks.length,
            peakTime: `${peakHour === 0 ? 12 : peakHour > 12 ? peakHour - 12 : peakHour} ${peakHour >= 12 ? 'PM' : 'AM'}`,
            peakDay,
            peakLocation
        },
        deviceBreakdown,
        browserStats: browserStatsFormatted,
        timelineData,
        topUrls,
        userLocations: generateUserLocations(allVisits),
        peakHours,
    };
};

// Transform to single URL analytics
export const transformToSingleUrlData = (mongoData, shortenedUrl) => {
    if (!mongoData || !mongoData.totalUrls) {
        return getDefaultSingleUrlData();
    }

    const url = mongoData.totalUrls.find(u => u.shortenedUrl === shortenedUrl);
    if (!url) {
        return getDefaultSingleUrlData();
    }

    const allClicks = [];
    const allVisits = [];
    const deviceStats = {};
    const browserStats = {};
    const osStats = {};
    const hourlyData = {};
    const dailyData = {};
    const referrerStats = {};

    if (url.clicks) {
        url.clicks.forEach(click => {
            allClicks.push(click);
            click.visits?.forEach(visit => {
                allVisits.push(visit);

                const device = getDeviceType(visit.device);
                deviceStats[device] = (deviceStats[device] || 0) + 1;

                const browser = getBrowser(visit.device);
                browserStats[browser] = (browserStats[browser] || 0) + 1;

                const os = getOS(visit.device);
                osStats[os] = (osStats[os] || 0) + 1;

                const referrer = visit.referer || 'Direct';
                referrerStats[referrer] = (referrerStats[referrer] || 0) + 1;

                if (visit.timestamp) {
                    const timestamp = new Date(visit.timestamp.$date || visit.timestamp);
                    const hour = timestamp.getHours();
                    hourlyData[hour] = (hourlyData[hour] || 0) + 1;

                    const day = timestamp.getDay();
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    dailyData[dayNames[day]] = (dailyData[dayNames[day]] || 0) + 1;
                }
            });
        });
    }

    const totalClicks = allVisits.length;
    // Calculate return users - clicks that have more than 1 visit
    let returnUsers = 0;
    allClicks.forEach(user => {
        if (user.visits.length > 1) {
            returnUsers += 1;
        }
    });

    const urlInfo = {
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shorten.dev'}/${shortenedUrl}`,
        originalUrl: url.originalUrl,
        createdDate: formatDate(url.createdDate),
        totalClicks,
        expiresAt: formatDate(url?.expiresAt),
        isActive: url.isActive,
    };
    const calculateBounceRate = (uniqueVisitors, returnVisitors) => {
        if (uniqueVisitors === 0) return 0;

        const singleVisitUsers = uniqueVisitors - returnVisitors;

        return ((singleVisitUsers / uniqueVisitors) * 100).toFixed(2);
    };
    const br = calculateBounceRate(allClicks.length, returnUsers)
    const stats = {
        totalClicks,
        uniqueVisitors: allClicks.length,
        returnVisitors: returnUsers,
        bounceRate: br,
        avgSessionDuration: "4m 32s",
    };

    const deviceData = {
        os: Object.entries(osStats).map(([name, value]) => ({
            name,
            value: Math.round((value / totalClicks) * 100),
            color: getColorForOS(name)
        })),
        browsers: Object.entries(browserStats).map(([name, value]) => ({
            name,
            value: Math.round((value / totalClicks) * 100),
            color: getColorForBrowser(name)
        })),
    };

    const referrerData = Object.entries(referrerStats).map(([source, clicks]) => ({
        source,
        clicks,
        percentage: Math.round((clicks / totalClicks) * 100),
        icon: getIconForReferrer(source)
    }));

    const timelineData = {
        hourly: generateHourlyData(allClicks),
        daily: generateDailyData(allClicks),
        weekly: generateWeeklyData(allClicks),
        monthly: generateMonthlyData(allClicks)
    };

    const clickHistory = allVisits.slice(0, 10).map((visit, index) => ({
        id: index + 1,
        timestamp: visit.timestamp?.$date || new Date().toISOString(),
        country: visit.location.country,
        device: getDeviceType(visit.device),
        browser: getBrowser(visit.device),
        referrer: visit.referer || 'Direct'
    }));

    const geographicData = generateGeographicData(allClicks)
    return {
        urlInfo,
        stats,
        geographicData: geographicData,
        deviceData,
        referrerData,
        timelineData,
        clickHistory
    };
};

const findTopLocationWithPercentage = (allClicks) => {
    const countryMap = {};
    const cityMap = {};
    let totalVisits = 0;

    allClicks.forEach(user => {
        user.visits.forEach(visit => {
            totalVisits++;

            const country = visit.location?.country;
            const city = visit.location?.city;

            if (country) {
                countryMap[country] = (countryMap[country] || 0) + 1;
            }

            if (city) {
                cityMap[city] = (cityMap[city] || 0) + 1;
            }
        });
    });

    if (totalVisits === 0) {
        return {
            totalVisits: 0,
            topCountry: null,
            topCity: null
        };
    }

    const topCountry = Object.entries(countryMap).reduce(
        (max, current) =>
            current[1] > max[1] ? current : max,
        ["", 0]
    );

    const topCity = Object.entries(cityMap).reduce(
        (max, current) =>
            current[1] > max[1] ? current : max,
        ["", 0]
    );

    return {
        totalVisits,

        topCountry: {
            name: topCountry[0],
            visits: topCountry[1],
            percentage: ((topCountry[1] / totalVisits) * 100).toFixed(2)
        },

        topCity: {
            name: topCity[0],
            visits: topCity[1],
            percentage: ((topCity[1] / totalVisits) * 100).toFixed(2)
        }
    };
};

export const getColor = (clicks, maxClicks) => {
  // Prevent division by zero
  if (maxClicks === 0) return '#FFCCBC'; 
  
  const intensity = clicks / maxClicks;

  if (intensity < 0.2) return '#FFE0B2'; // Very Light Orange
  if (intensity < 0.5) return '#FFB74D'; // Medium Orange
  if (intensity < 0.8) return '#F4511E'; // Bright Red/Orange
  return '#B71C1C';                      // Deep Dark Red (High Clicks)
};

// Helper functions
const getColorForDevice = (device) => {
    const colors = {
        'Mobile': '#667eea',
        'Desktop': '#764ba2',
        'Tablet': '#6B8DD6'
    };
    return colors[device] || '#9CA3AF';
};

const getColorForBrowser = (browser) => {
    const colors = {
        'Chrome': '#4285F4',
        'Safari': '#FF9500',
        'Firefox': '#FF7139',
        'Edge': '#0078D4'
    };
    return colors[browser] || '#9CA3AF';
};

const getColorForOS = (os) => {
    const colors = {
        'iOS': '#000000',
        'Android': '#3DDC84',
        'Windows': '#0078D4',
        'Mac': '#555555',
        'Linux': '#FCC624'
    };
    return colors[os] || '#9CA3AF';
};

const getIconForReferrer = (source) => {
    const icons = {
        'Direct': '🔗',
        'Google Search': '🔍',
        'Facebook': '📘',
        'Twitter/X': '🐦',
        'Email': '📧',
        'LinkedIn': '💼',
        'Instagram': '📷',
        'Reddit': '🔴'
    };
    return icons[source] || '📱';
};

const generateHourlyData = (allClicks) => {
    // Create 24 fixed buckets
    const hourlyMap = Array.from({ length: 24 }, () => ({
        visits: 0,
        users: new Set()
    }));

    allClicks.forEach(click => {
        const { userId, visits } = click;

        visits.forEach(visit => {
            const date = new Date(visit.timestamp);
            const hour = date.getUTCHours();
            // use getHours() if you want local server time

            hourlyMap[hour].visits += 1;
            hourlyMap[hour].users.add(userId);
        });
    });

    return hourlyMap.map((bucket, index) => ({
        hour: formatHour(index),
        visits: bucket.visits,
        users: bucket.users.size
    }));
};

const formatHour = (hour) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}${ampm}`;
};

const generateDailyData = (allClicks) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dailyMap = days.map(() => ({
        visits: 0,
        users: new Set()
    }));

    allClicks.forEach(click => {
        const { userId, visits } = click;

        visits.forEach(visit => {
            const date = new Date(visit.timestamp);
            const dayIndex = date.getUTCDay();

            dailyMap[dayIndex].visits += 1;
            dailyMap[dayIndex].users.add(userId);
        });
    });

    return days.map((day, index) => ({
        day,
        visits: dailyMap[index].visits,
        users: dailyMap[index].users.size
    }));
};

const generateWeeklyData = (allClicks) => {
    const weeklyMap = Array.from({ length: 5 }, () => ({
        visits: 0,
        users: new Set()
    }));

    allClicks.forEach(click => {
        const { userId, visits } = click;

        visits.forEach(visit => {
            const date = new Date(visit.timestamp);
            const dayOfMonth = date.getUTCDate();
            const weekNumber = Math.ceil(dayOfMonth / 7) - 1; // index 0–4

            weeklyMap[weekNumber].visits += 1;
            weeklyMap[weekNumber].users.add(userId);
        });
    });

    return weeklyMap.map((week, index) => ({
        week: `Week${index + 1}`,
        visits: week.visits,
        users: week.users.size
    }));
};

const generateMonthlyData = (allClicks) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyMap = months.map(() => ({
        visits: 0,
        users: new Set()
    }));

    allClicks.forEach(click => {
        const { userId, visits } = click;

        visits.forEach(visit => {
            const date = new Date(visit.timestamp);
            const monthIndex = date.getUTCMonth();

            monthlyMap[monthIndex].visits += 1;
            monthlyMap[monthIndex].users.add(userId);
        });
    });

    return months.map((month, index) => ({
        month,
        visits: monthlyMap[index].visits,
        users: monthlyMap[index].users.size
    }));
};

const generatePeakHours = (hourlyData) => {
    const ranges = [
        { time: '12AM-3AM', start: 0, end: 3 },
        { time: '3AM-6AM', start: 3, end: 6 },
        { time: '6AM-9AM', start: 6, end: 9 },
        { time: '9AM-12PM', start: 9, end: 12 },
        { time: '12PM-3PM', start: 12, end: 15 },
        { time: '3PM-6PM', start: 15, end: 18 },
        { time: '6PM-9PM', start: 18, end: 21 },
        { time: '9PM-12AM', start: 21, end: 24 }
    ];

    const totalClicks = Object.values(hourlyData).reduce((sum, val) => sum + val, 0) || 10000;

    return ranges.map(range => {
        let clicks = 0;
        for (let i = range.start; i < range.end; i++) {
            clicks += hourlyData[i] || 0;
        }
        return {
            time: range.time,
            clicks,
            percentage: Math.round((clicks / totalClicks) * 100)
        };
    });
};

const generateGeographicData = (allClicks) => {
    const countryMap = {};
    let totalVisits = 0;

    allClicks.forEach(click => {
        click.visits.forEach(visit => {
            const { country, country_code, flag } = visit.location;

            if (!countryMap[country_code]) {
                countryMap[country_code] = {
                    country,
                    countryCode: country_code,
                    flag: flag?.country_flag_emoji || "",
                    clicks: 0
                };
            }

            countryMap[country_code].clicks += 1;
            totalVisits += 1;
        });
    });

    return Object.values(countryMap)
        .map(item => ({
            country: item.country,
            countryCode: item.countryCode,
            flag: item.flag,
            clicks: item.clicks,
            percentage: Number(((item.clicks / totalVisits) * 100).toFixed(2))
        }))
        .sort((a, b) => b.clicks - a.clicks);
};

const generateUserLocations = (allVisits) => {
    // Use getCountryStats to get actual country statistics from visits
    return getCountryStats(allVisits);
};

const getDefaultAnalyticsData = () => ({
    overview: { totalClicks: 0, returnUsers: 0, realUsers: 0, peakTime: 'N/A', peakDay: 'N/A' },
    deviceBreakdown: [],
    browserStats: [],
    timelineData: { hourly: [], daily: [], weekly: [], monthly: [] },
    topUrls: [],
    userLocations: [],
    peakHours: []
});

const getDefaultSingleUrlData = () => ({
    urlInfo: { shortUrl: '', originalUrl: '', createdDate: '', totalClicks: 0, expiresAt: '', isActive: false },
    stats: { totalClicks: 0, uniqueVisitors: 0, returnVisitors: 0, bounceRate: 0, avgSessionDuration: '0m 0s' },
    geographicData: [],
    deviceData: { os: [], browsers: [] },
    referrerData: [],
    timelineData: { hourly: [], daily: [], weekly: [], monthly: [] },
    clickHistory: []
});
