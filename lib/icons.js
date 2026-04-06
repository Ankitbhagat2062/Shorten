"use client";
import { useUrlStore } from "@/store/useUrlStore";
import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getColor } from "./analyticsUtils";
 
// Icon components
export const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

export const HomeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const AnalyticsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const ProfileIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const ActiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const EditIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const DeleteIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

export const BurgerIcon = ({ className }) => (
  <svg className={`${className} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// Icon Components
export const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export const GlobeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export const DeviceIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const BrowserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export const TrendUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const TrendDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

export const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const CopyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const ExternalLinkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const TargetIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export const TableIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
export const CancelIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
// Toast Component
export const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10  font-extrabold right-6 z-50 animate-fade-in-up">
      <div className={`
        flex items-center gap-3 px-5 py-4 rounded-xl glass-card text-white border-2
        ${type === 'success' ? 'border-green-500/50' : type === 'error' ? 'border-red-500/50' : 'border-blue-500/80'}
      `}>
        {type === 'success' && <CheckIcon className="w-5 h-5 text-green-400" />}
        {type === 'error' && <XIcon className="w-5 h-5 text-red-400" />}
        {type === 'info' && <CopyIcon className="w-5 h-5 text-blue-400" />}
        <span className="text-white font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Stats Card Component
export const StatsCard = ({ icon: Icon, title, value, change, changeType, delay, suffix = "" }) => {
  // Split value into number and text parts
  const valueStr = String(value);
  const numericPart = valueStr.replace(/[^0-9.]/g, '');
  const textPart = valueStr.replace(/[0-9.]/g, '').trim();

  return (
    <div
      className="glass-card rounded-2xl p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter value={numericPart || 0} />
            {textPart && <span className="text-xl ml-1">{textPart}</span>}
            {suffix && <span className="text-xl ml-1">{suffix}</span>}
          </p>
          <p className={`flex items-center justify-center  text-sm mt-2 ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'positive' ? (
              <TrendUpIcon className="w-4 h-4" />
            ) : (
              <TrendDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{change}%</span>
            <span className="text-white/40 text-xs ml-1">from last month</span>
          </p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

// URL Table Row Component
export const UrlTableRow = ({ url, onEdit, onDelete, onCopy, delay }) => (
  <tr
    className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <td className="py-4 px-1">
      <span className="text-[#1034d4] font-semibold cursor-pointer hover:underline">
        {url.shortName}
      </span>
    </td>
    <td className="py-4 px-1">
      <div className="max-w-xs truncate text-white/70" title={url.originalUrl}>
        {url.originalUrl}
      </div>
    </td>
    <td className="py-4 px-1">
      <span className="bg-[#667eea]/20 text-[#133aea] px-3 py-1 rounded-full text-sm font-medium">
        {url.clicks.toLocaleString()}
      </span>
    </td>
    <td className="py-4 px-1 text-white/70">{url.createdDate}</td>
    <td className="py-4 px-1">
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg bg-blue-500/20 text-blue-700 hover:bg-blue-800/30 transition-colors"
          title="Edit"
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-500/20 text-red-700 hover:bg-red-800/30 transition-colors"
          title="Delete"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onCopy}
          className="p-2 rounded-lg bg-green-800/20 text-green-700 hover:bg-green-500/30 transition-colors"
          title="Copy"
        >
          <CopyIcon className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

// Create URL Modal Component
export const CreateUrlModal = ({ isOpen, onClose, onSubmit }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [shortenedResult, setShortenedResult] = useState('');
  const { isLoading, error } = useUrlStore()

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ originalUrl, shortCode });
    setShortenedResult(`${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`)
    setOriginalUrl('');
    setShortCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass-card rounded-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Create New Short URL</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {error &&
          <h2 className='text-red-500'>{error}</h2>
        }
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-medium mb-2">Original URL</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="input-glass w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">Custom Short Code (optional)</label>
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="my-custom-link"
              className="input-glass w-full"
            />
          </div>
          <button disabled={isLoading} type="submit" className="btn-primary disabled:opacity-20 w-full p-2">
            {isLoading ? 'Shortening your Url' : 'Create your Url'}
          </button>
        </form>
        {shortenedResult && (
          <div className="mt-6 p-4 bg-green-500 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium py-2">Your shortened URL:</p>
            <Link
              href={shortenedResult}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 bg-amber-50/0 hover:underline break-all"
            >
              {shortenedResult}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Donut Chart Component
export const DonutChart = ({ data, size = 180 }) => {
  const radius = (size - 30) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="20"
        />
        {/* Data segments */}
        {data.map((item, index) => {
          const segmentLength = (item.value / 100) * circumference;
          const offset = accumulatedOffset;
          accumulatedOffset += segmentLength;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="20"
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-offset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-xs">Total</p>
          <p className="text-white font-bold text-2xl">{data.reduce((a, b) => a + b.value, 0)}%</p>
        </div>
      </div>
    </div>
  );
};

// URL Info Card Component
export const UrlInfoCard = ({ urlInfo, delay }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilExpiry = () => {
    const now = new Date();
    const expiry = new Date(urlInfo.expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div
      className="glass-card rounded-2xl p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="sm:text-xl font-bold text-white flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-[#667eea]" />
          URL Information
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${urlInfo.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {urlInfo.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Short URL */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-xs mb-1">Short URL</p>
              <div className="flex items-center gap-2">
                <Link
                  href={urlInfo.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1238e2] font-semibold hover:underline truncate"
                >
                  {urlInfo.shortUrl}
                </Link>
                <ExternalLinkIcon className="w-4 h-4 text-white/40 shrink-0" />
              </div>
            </div>
            <CopyButton text={urlInfo.shortUrl} label="Copy short URL" />
          </div>
        </div>

        {/* Original URL */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-xs mb-1">Original URL</p>
              <div className="flex items-center gap-2">
                <Link
                  href={urlInfo.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 font-medium hover:text-white hover:underline truncate text-sm"
                >
                  {urlInfo.originalUrl}
                </Link>
                <ExternalLinkIcon className="w-4 h-4 text-white/40 shrink-0" />
              </div>
            </div>
            <CopyButton text={urlInfo.originalUrl} label="Copy original URL" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Created Date</p>
            <p className="text-white text-xs sm:text-sm font-medium">{formatDate(urlInfo.createdDate)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Expires In</p>
            <p className="text-white font-medium">{getDaysUntilExpiry() === 0 ? 'Expired' : getDaysUntilExpiry() + 'days'}</p>
          </div>
        </div>

        {/* Total Clicks Badge */}
        <div className="bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Clicks</p>
              <p className="text-3xl font-bold text-white">{urlInfo.totalClicks.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Copy Button Component
export const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm"
      title={label}
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-400" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

// Progress Bar Chart
export const ProgressBarChart = ({ data, delay = 0 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="animate-fade-in-up"
          style={{ animationDelay: `${delay + (index * 100)}ms` }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/80 text-sm">{item.name}</span>
            </div>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Line Chart Component
export const LineChart = ({ data, dataKey, color, height = 200, delay = 0, xKey = 'hour' }) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d[dataKey] / maxValue) * 100,
    value: d[dataKey],
  }));

  const pathD = points.map((p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  ).join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}

        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaD}
          fill={`url(#gradient-${dataKey})`}
          className="transition-all duration-1000"
        />

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill={color}
            className="transition-all duration-300"
          />
        ))}
      </svg>

      <div className="flex justify-between mt-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((d, i) => (
          <span
            key={i}
            className="text-white/40 text-xs whitespace-nowrap"
          >
            {d[xKey]}
          </span>
        ))}
      </div>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({ data, height = 200, delay = 0 }) => {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full bg-linear-to-t from-[#667eea] to-[#764ba2] rounded-t-lg transition-all duration-700 hover:from-[#764ba2] hover:to-[#667eea]"
              style={{
                height: `${(item.percentage / 100) * height}px`,
                minHeight: '4px'
              }}
              title={`${item.time}: ${item.clicks.toLocaleString()} clicks (${item.percentage}%)`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 overflow-x-auto sm:overflow-x-hidden">
        {data.map((d, i) => (
          <span
            key={i}
            className="text-white/40 text-xs"
          >
            {d.time}
          </span>
        ))}
      </div>
    </div>
  );
};

// World Map Component (Simplified SVG)
export const WorldMap = ({ locations }) => {
  const maxClicks = Math.max(...locations.map(l => l.clicks));

  return (
    <div className="relative w-full h-full min-h-75">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Simplified world map background */}
        <defs>
          <linearGradient id="mapGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect fill="url(#mapGradient)" width="800" height="400" rx="10" />

        {/* Simplified continent shapes */}
        {/* North America */}
        <path
          d="M 100 80 Q 150 60 200 80 Q 250 100 220 150 Q 180 180 150 160 Q 100 140 100 80"
          fill="rgba(102, 126, 234, 0.2)"
          stroke="rgba(102, 126, 234, 0.4)"
          strokeWidth="1"
        />
        {/* South America */}
        <path
          d="M 180 200 Q 220 180 240 220 Q 250 280 220 320 Q 180 340 160 300 Q 150 250 180 200"
          fill="rgba(118, 75, 162, 0.2)"
          stroke="rgba(118, 75, 162, 0.4)"
          strokeWidth="1"
        />
        {/* Europe */}
        <path
          d="M 380 60 Q 420 50 460 70 Q 480 100 450 130 Q 400 140 380 100 Q 360 80 380 60"
          fill="rgba(107, 141, 214, 0.2)"
          stroke="rgba(107, 141, 214, 0.4)"
          strokeWidth="1"
        />
        {/* Africa */}
        <path
          d="M 400 150 Q 450 140 480 180 Q 500 250 460 300 Q 410 320 380 280 Q 360 220 400 150"
          fill="rgba(102, 126, 234, 0.2)"
          stroke="rgba(102, 126, 234, 0.4)"
          strokeWidth="1"
        />
        {/* Asia */}
        <path
          d="M 500 50 Q 600 40 700 80 Q 750 150 700 200 Q 600 220 550 180 Q 480 120 500 50"
          fill="rgba(118, 75, 162, 0.2)"
          stroke="rgba(118, 75, 162, 0.4)"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M 650 280 Q 700 270 730 300 Q 740 340 710 360 Q 670 350 650 320 Q 640 300 650 280"
          fill="rgba(107, 141, 214, 0.2)"
          stroke="rgba(107, 141, 214, 0.4)"
          strokeWidth="1"
        />

        {/* Location markers with heat indicators */}
        {locations.map((location, index) => {
          // Map country coordinates to SVG
          const coords = {
            'US': { x: 180, y: 100 },
            'GB': { x: 400, y: 80 },
            'DE': { x: 430, y: 85 },
            'FR': { x: 410, y: 100 },
            'CA': { x: 160, y: 70 },
            'AU': { x: 700, y: 320 },
            'IN': { x: 560, y: 170 },
            'BR': { x: 250, y: 260 },
            'JP': { x: 700, y: 130 },
            'NL': { x: 415, y: 80 },
            'ES': { x: 390, y: 110 },
            'IT': { x: 440, y: 115 },
          };

          const coord = coords[location.countryCode] || { x: 400, y: 200 };
          const intensity = location.clicks / maxClicks;
          const radius = 10 + (intensity * 25);

          return (
            <g key={location.countryCode}>
              {/* Heat circle */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r={radius}
                fill={`rgba(102, 126, 234, ${0.2 + (intensity * 0.3)})`}
                className="animate-pulse"
              />
              {/* Inner circle */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r={radius * 0.5}
                fill={`rgba(118, 75, 162, ${0.4 + (intensity * 0.4)})`}
              />
              {/* Center point */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r={3}
                fill="#fff"
              />
              {/* Tooltip */}
              <title>{`${location.country}: ${location.clicks.toLocaleString()} clicks`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Map Legend Component
const MapLegend = () => {
  const legendItems = [
    { label: 'Very Low (0-20%)', color: '#FFE0B2' },
    { label: 'Low (20-50%)', color: '#FFB74D' },
    { label: 'Medium (50-80%)', color: '#F4511E' },
    { label: 'High (80-100%)', color: '#B71C1C' },
  ];

  return (
    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-10">
      <p className="text-white text-xs font-semibold mb-2">Click Intensity</p>
      <div className="flex flex-col gap-1.5">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border border-white/30" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white/80 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GoogleMapView = ({ locations }) => {
  // 1. Find the highest click count to calculate intensity
  const maxClicks = Math.max(...locations.map(loc => loc.clicks || 0), 1);
  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 20, lng: 0 }}
          defaultZoom={2}
          mapId="YOUR_MAP_ID"
        >
          {locations.map((loc, index) => {
            const pinColor = getColor(loc.clicks, maxClicks);

            return (
              <AdvancedMarker
                key={index}
                position={{ lat: loc.lat, lng: loc.lng }}
              >
                <Pin
                  background={pinColor}
                  borderColor={'#ffffff'}
                  glyphColor={'#ffffff'}
                  scale={1.2} // Make markers slightly larger
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
      {/* Legend overlay */}
      <MapLegend />
    </div>
  );
}

// Animated Counter Component
export const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/,/g, ''));
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, Math.max(incrementTime, 1));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};
