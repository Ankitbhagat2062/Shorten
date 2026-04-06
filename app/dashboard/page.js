'use client'
import React, { useState, useEffect } from "react";
import { ActiveIcon, AnalyticsIcon, CancelIcon, CreateUrlModal, DeleteIcon, EyeIcon, FilterIcon, LineChart, LinkIcon, PlusIcon, SearchIcon, StatsCard, Toast, UrlTableRow } from "@/lib/icons";
import AsideWrapper from "@/components/AsideWrapper";
import { useSidebar } from "@/context/SidebarContext";
import { useUrlStore } from "@/store/useUrlStore";
import { timelineViews } from "@/lib/constants";
import Form from "@/components/Form";
import NoData from "@/components/NoData";
const Dashboard = () => {
    // All hooks must be called unconditionally at the top level
    const { mockUrls, stats, analyticsData,deviceId, setCurrentShortenedUrl, setOriginalUrl, setError } = useUrlStore()
    const { isOpen } = useSidebar();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [urls, setUrls] = useState(mockUrls);
    const [toasts, setToasts] = useState([]);
    const [activeChart, setActiveChart] = useState('hourly');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showForm, setShowForm] = useState(false)
    const [showDelete, setShowDelete] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState(null);
    useEffect(() => {
        if (mockUrls.length > 0) {
            setUrls(mockUrls);
        }
    }, [mockUrls]);

    if (!analyticsData) {
        return (
            <>
                <AsideWrapper >
                   <NoData />
                </AsideWrapper>
            </>
        )
    }
    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleEdit = async (url) => {
        setOriginalUrl(url.originalUrl)
        setCurrentShortenedUrl(url.shortName)
        addToast(`Editing "${url.shortName}"`, 'info');
        setShowForm(true);
    };

    const handleDelete = async (url) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "deviceId": deviceId,
            "shortUrl": url.shortName,
            "originalUrl": url.originalUrl
        });

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("http://localhost:3000/api/delete-url", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) addToast(`Deleted "${url.shortName}"`, 'success');
                else addToast(`Error Deleting "${url.shortName}"`, 'error');
            })
            .catch(error => console.log('error', error));
    };

    const confirmDelete = (url) => {
        setUrlToDelete(url);
        setShowDelete(true);
        setUrls(prev => prev.filter(u => u.id !== url.id));
    };

    const handleConfirmDelete = () => {
        if (urlToDelete) {
            handleDelete(urlToDelete);
        }
        setShowDelete(false);
        setUrlToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDelete(false);
        setUrlToDelete(null);
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url.shortName);
        addToast(`Copied "${url.shortName}" to clipboard!`, 'success');
    };

    const handleCreateUrl = async (data) => {
        if (!data) return;
        const newUrl = {
            id: Date.now(),
            shortName: data.shortCode ? `${data.shortCode}` : `/url${urls.length + 1}`,
            originalUrl: data.originalUrl,
            clicks: 0,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'active',
        };

        setIsLoading(true);
        setError(null);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "deviceId": deviceId,
            "originalUrl": data.originalUrl,
            "shortenedUrl": data.shortCode
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch("http://localhost:3000/api/shorten", requestOptions);
            const result = await response.json();

            console.log(result);

            if (result.success) {
                addToast(result.message, 'success')
                setUrls(prev => [newUrl, ...prev]);
            } else {
                addToast(result.message, 'error')
                setError(result.message);
            }
        } catch (err) {
            console.log('error', err);
            setError(err.message);
        }

        setIsLoading(false);
        setIsModalOpen(false);
    };

    const filteredUrls = urls.filter(url => {
        const matchesSearch = url.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'active' && url.status === 'active') ||
            (filterStatus === 'inactive' && url.status === 'inactive');
        return matchesSearch && matchesFilter;
    });
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
    return (
        <>
            <AsideWrapper>
                <main className="w-full flex justify-end">
                    <div className={`flex flex-col items-center justify-center`}>
                        {/* Top Bar */}
                        <header className={`${isOpen ? ' w-[calc(100vw-60px)] ' : 'w-[calc(100vw-180px)]'} py-2 glass flex justify-between items-center fixed top-0 z-10`}>
                            <div className="flex items-center justify-between w-full px-3">
                                <div className="px-3">
                                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                                    <p className="text-white/60 text-sm">Manage your shortened URLs</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn-primary p-2 flex items-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span className="hidden md:block">Create New Short URL</span>
                                </button>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main
                            className={` w-[calc(100vw-60px)] ${!isOpen && 'md:w-[calc(100vw-180px)] '}
          flex-1 transition-all duration-300 mt-18`}
                        >
                            {/* Dashboard Content */}
                            <div className="py-6 px-2 space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatsCard
                                        icon={LinkIcon}
                                        title="Total URLs Created"
                                        value={stats.totalUrls}
                                        change={12.5}
                                        changeType="positive"
                                        delay={100}
                                    />
                                    <StatsCard
                                        icon={EyeIcon}
                                        title="Total Views/Clicks"
                                        value={stats.totalViews}
                                        change={8.2}
                                        changeType="positive"
                                        delay={200}
                                    />
                                    <StatsCard
                                        icon={ActiveIcon}
                                        title="Active Links"
                                        value={stats.activeLinks}
                                        change={3.1}
                                        changeType="negative"
                                        delay={300}
                                    />
                                </div>

                                {/* Recent URLs Table */}
                                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                    {/* Table Header with Search and Filter */}
                                    <div className="p-6 border-b border-white/10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <h2 className="text-xl font-bold text-white">Recent URLs</h2>
                                            <div className="flex flex-col md:flex-row gap-3">
                                                {/* Search */}
                                                <div className="relative input-glass">
                                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <input name="search"
                                                        type="text"
                                                        placeholder="Search URLs..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="pl-6 pr-4w-full md:w-64 focus-within:border-0 focus-within:outline-none "
                                                    />
                                                </div>
                                                {/* Filter */}
                                                <div className="relative input-glass">
                                                    <FilterIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                                    <select
                                                        value={filterStatus}
                                                        onChange={(e) => setFilterStatus(e.target.value)}
                                                        className="pl-6 pr-4 w-full md:w-40 appearance-none focus-within:border-0 focus-within:outline-none cursor-pointer"
                                                    >
                                                        <option className=" bg-black px-12" value="all">All Status</option>
                                                        <option className="bg-black" value="active">Active</option>
                                                        <option className="bg-black" value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-4 px-1 text-white/60 font-semibold text-sm">Short Name</th>
                                                    <th className="text-left py-4 px-1 text-white/60 font-semibold text-sm">Original URL</th>
                                                    <th className="text-left py-4 px-1 text-white/60 font-semibold text-sm">Clicks</th>
                                                    <th className="text-left py-4 px-1 text-white/60 font-semibold text-sm">Created Date</th>
                                                    <th className="text-left py-4 px-1 text-white/60 font-semibold text-sm">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUrls.map((url, index) => (
                                                    <UrlTableRow
                                                        key={url.id}
                                                        url={url}
                                                        onEdit={() => handleEdit(url)}
                                                        onDelete={() => confirmDelete(url)}
                                                        onCopy={() => handleCopy(url)}
                                                        delay={500 + (index * 100)}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Empty State */}
                                    {filteredUrls.length === 0 && (
                                        <div className="p-12 text-center">
                                            <LinkIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                            <p className="text-white/60 text-lg">No URLs found</p>
                                            <p className="text-white/40 text-sm">Try adjusting your search or filter</p>
                                        </div>
                                    )}

                                    {/* Table Footer */}
                                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                                        <p className="text-white/60 text-sm">
                                            Showing {filteredUrls.length} of {urls.length} URLs
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm">
                                                Previous
                                            </button>
                                            <button className="px-4 py-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats Visualization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Top Performing URLs */}
                                    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                                        <h3 className="text-lg font-bold text-white mb-4">Top Performing URLs</h3>
                                        <div className="space-y-4">
                                            {urls.slice(0, 3).map((url, index) => (
                                                <div key={url.id} className="flex items-center gap-4">
                                                    <span className="text-white/40 font-bold text-xl w-6">#{index + 1}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-white font-medium truncate">{url.shortName}</span>
                                                            <span className="text-[#1135d6] font-semibold">{url.clicks.toLocaleString()} clicks</span>
                                                        </div>
                                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all duration-500"
                                                                style={{ width: `${(url.clicks / 2500) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Activity Chart Placeholder */}
                                    <div className="glass-card rounded-2xl p-3 sm:p-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                                        <div className="flex gap-2 sm:gap-0  md:flex-col items-center justify-between mb-6">
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
                                </div>
                            </div>
                        </main>
                    </div>

                    {/* Create URL Modal */}
                    <CreateUrlModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleCreateUrl}
                    />

                    {/* Toast Notifications */}
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}

                </main>
            </AsideWrapper>
            {showForm &&
                <div className="fixed top-0 z-101 h-full w-full bg-black/50 flex items-center justify-center">
                    <div className="flex relative">
                        <button type="button" onClick={() => setShowForm(!showForm)}
                            className="absolute top-3 z-102 cursor-pointer font-bold right-3 w-10 h-10 flex items-center justify-center">
                            <CancelIcon className="w-10 h-10 text-red-600" />
                        </button>
                        <Form button={'Update'} />
                    </div>
                </div>
            }
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancelDelete}></div>
                    <div className="relative glass-card rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <DeleteIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Confirm Delete</h3>
                            <p className="text-white/60 mb-4">Are you sure you want to delete this URL?</p>

                            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                                <div className="mb-3">
                                    <p className="text-white/60 text-xs mb-1">Short URL</p>
                                    <p className="text-[#667eea] font-semibold">{urlToDelete?.shortName}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs mb-1">Original URL</p>
                                    <p className="text-white/80 text-sm truncate">{urlToDelete?.originalUrl}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button"
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard
