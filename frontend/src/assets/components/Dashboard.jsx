import React, { useState, useEffect, useCallback } from 'react';
import { useTotalClicks, getFormattedDate } from './../../hooks/useTotalClicks'; 
import ClicksChart from './ClicksChart'; 
import { motion, AnimatePresence } from 'framer-motion'; 

// --- ICON DUMMIES ---
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>);
const Logo = () => (<span className="text-indigo-400 text-3xl">🔗</span>); 
const CopyIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2M8 5h8M8 5a2 2 0 00-2 2h12a2 2 0 00-2-2"></path></svg>);
const ClicksIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>);
const ChartBarIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6"></path></svg>);


// --- THEME COLORS ---
const THEME = {
  BACKGROUND: '#1e1e1e',
  FOREGROUND: '#ffffff', 
  ACCENT: '#4f46e5',     // Indigo 600
  CARD_BG: '#2d2d2d',    
  BORDER: '#444444',
};

// --- API Endpoints ---
const SHORTEN_URL_API = 'http://localhost:8080/api/urls/shorten';
const MY_URLS_API = 'http://localhost:8080/api/urls/myurls';
const ANALYTICS_API_BASE = 'http://localhost:8080/api/urls/analytics/';
const CLIENT_BASE_URL = 'http://localhost:8080/'; // ✅ CORRECTED: Frontend URL


// --- Initial Date Setup (Fixes the TypeError) ---
// Initialize the date objects first
const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

// Now format them for initial state strings
const initialEndDate = getFormattedDate(today);
const initialStartDate = getFormattedDate(oneMonthAgo);

// Helper function to format Date object into the required ISO string format: YYYY-MM-DDTHH:MM:SS
const formatApiDate = (dateString) => {
    if (!dateString) return '';
    
    // Ensure we are working with a Date object for toISOString()
    let date = dateString instanceof Date ? dateString : new Date(dateString);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
};


// =======================================================
// THE HEADER COMPONENT
// =======================================================
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
        { name: 'Home', href: '/' }, 
        { name: 'About', href: '/about' }, 
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Logo />
                    <span className="text-2xl font-bold text-white ml-2">TinyTrail</span>
                </div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                         <a key={link.name} href={link.href} className="text-slate-300 hover:text-indigo-400 transition-colors">{link.name}</a>
                    ))}
                    <a href="/" className="py-2 px-5 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                        Log Out
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-indigo-400 z-50">
                    {isOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
            
            {/* Mobile Navigation Menu */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800"
                >
                    <nav className="flex flex-col items-center space-y-4 py-8">
                         {navLinks.map(link => (
                             <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 text-lg hover:text-indigo-400 transition-colors">{link.name}</a>
                        ))}
                        <a href="/logout" className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">
                            Log Out
                        </a>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};


// =======================================================
// URL Card Component
// =======================================================
const UrlCard = ({ url, theme, onAnalyticsClick }) => {
    // Construct full URL using the correct client base URL
    const displayShortUrl = url.shortUrl.startsWith('http') ? url.shortUrl : CLIENT_BASE_URL + url.shortUrl;

    const handleCopy = () => {
        navigator.clipboard.writeText(displayShortUrl);
        alert('Copied to clipboard!'); // Simple feedback
    };
    
    // Safely parse the date, defaulting to 'N/A' if null/invalid
    const formattedDate = url.createdDate 
        ? new Date(url.createdDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        : 'N/A';

    return (
        <div className="p-5 rounded-lg border-l-4" style={{ 
            backgroundColor: theme.CARD_BG, 
            borderColor: theme.ACCENT, 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' 
        }}>
            <p className="text-sm font-light text-neutral-400 mb-1 truncate">Created: {formattedDate} by {url.username || 'Anonymous'}</p>
            
            <a 
                href={url.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-neutral-300 hover:text-indigo-400 transition-colors block truncate mb-3"
            >
                Original: {url.originalUrl}
            </a>

            <div className="flex justify-between items-center mb-4 border-b border-neutral-700 pb-2">
                <span className="text-lg font-mono text-indigo-300 truncate mr-2">
                    <a href={displayShortUrl} target="_blank" rel="noopener noreferrer">
                        {displayShortUrl}
                    </a>
                </span>
                <button 
                    onClick={handleCopy} 
                    className="p-2 rounded-full text-indigo-400 hover:bg-neutral-700 transition"
                >
                    <CopyIcon />
                </button>
            </div>

            <div className="flex justify-between items-center text-lg font-semibold text-white">
                <div className="flex items-center">
                    <ClicksIcon />
                    <span className="ml-2 text-2xl" style={{ color: theme.ACCENT }}>
                        {/* Ensure clickCount is treated as a number, defaulting to 0 */}
                        {Number(url.clickCount || 0).toLocaleString()} 
                    </span>
                    <span className="ml-2 text-neutral-400 text-sm">CLICKS</span>
                </div>
                
                {/* NEW ANALYTICS BUTTON */}
                <button 
                    onClick={() => onAnalyticsClick(url.shortUrl)}
                    className="py-1 px-3 text-sm rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition flex items-center"
                >
                    <ChartBarIcon />
                    <span className="ml-1">Analytics</span>
                </button>
            </div>
        </div>
    );
};


// =======================================================
// NEW: Analytics Modal Component
// =======================================================
const AnalyticsModal = ({ shortUrl, onClose }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default dates for API call (1 month ago to now)
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [dataRange, setDataRange] = useState({ start: initialStartDate, end: initialEndDate });

    // Function to fetch analytics
    const fetchAnalytics = useCallback(async (start, end) => {
        setLoading(true);
        setError(null);
        
        // 1. Get Token and check it immediately
        const token = localStorage.getItem('JWT_TOKEN')?.replace(/"/g, '');
        if (!token) { 
            setError("Missing authentication token.");
            setLoading(false);
            return; 
        }

        // 2. Construct API URL, including date parameters
        // Note: We use the formatApiDate helper to convert the YYYY-MM-DD string inputs to ISO format
       let apiUrl = `${ANALYTICS_API_BASE}${shortUrl}?startDate=${formatApiDate(start)}&endDate=${formatApiDate(end)}`;

        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 404) {
                 throw new Error("Analytics data not found.");
            }
            if (!response.ok) {
                 throw new Error(`Failed to fetch analytics (Status: ${response.status}). Please check your API URL format.`);
            }

            const data = await response.json();
            setAnalyticsData(data);
            setDataRange({ start, end });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [shortUrl]);

    useEffect(() => {
        // Fetch default data on mount
        fetchAnalytics(startDate, endDate);
    }, [fetchAnalytics]);
    
    // Calculate total clicks
    const totalClicks = analyticsData ? analyticsData.reduce((sum, item) => sum + item.count, 0) : 0;

    const handleDateSearch = () => {
        // Fetch data using the dates in the input fields
        fetchAnalytics(startDate, endDate);
    };


    return (
        // Modal Backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} 
                style={{ backgroundColor: THEME.CARD_BG, color: THEME.FOREGROUND }}
                className="w-full max-w-2xl p-6 rounded-xl border border-neutral-700 relative"
            >
                <h2 className="text-2xl font-semibold mb-2 text-indigo-400">Analytics for:</h2>
                <p className="text-lg font-mono text-neutral-300 break-all mb-4">{CLIENT_BASE_URL + shortUrl}</p>
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
                >
                    <XIcon />
                </button>
                
                {/* Date Controls */}
                <div className="flex flex-wrap items-end gap-4 border-b border-neutral-700 pb-4 mb-4">
                     {/* Input Start Date */}
                    <div>
                        <label className="block text-sm text-neutral-400">Start Date:</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
                               className="bg-neutral-800 text-white p-2 rounded border border-neutral-600" />
                    </div>
                     {/* Input End Date */}
                    <div>
                        <label className="block text-sm text-neutral-400">End Date:</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} 
                               className="bg-neutral-800 text-white p-2 rounded border border-neutral-600" />
                    </div>
                    <button 
                        onClick={handleDateSearch} 
                        disabled={loading}
                        className="py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                    >
                        Search
                    </button>
                </div>
                
                {/* Results Display */}
                <div className="space-y-4">
                    {loading && <p className="text-indigo-400">Loading click data...</p>}
                    {error && <p className="text-red-400">Error: {error}</p>}

                    {!loading && !error && (
                        <>
                            {/* Total Clicks Card */}
                            <div className="p-4 rounded-lg border-l-4 border-indigo-500 bg-neutral-800">
                                <p className="text-sm text-neutral-400">Total Clicks in Range: {formatDateDisplay(dataRange.start)} to {formatDateDisplay(dataRange.end)}</p>
                                <h3 className="text-4xl font-extrabold text-white mt-1">{totalClicks.toLocaleString()}</h3>
                            </div>
                            
                            {/* Detailed List */}
                            {analyticsData && analyticsData.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto" style={{ border: `1px solid ${THEME.BORDER}` }}>
                                    <table className="w-full text-left text-neutral-300">
                                        <thead className="sticky top-0" style={{ backgroundColor: THEME.CARD_BG }}>
                                            <tr className="border-b border-neutral-700">
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Clicks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData.map((item, index) => (
                                                <tr key={index} className="border-b border-neutral-800 hover:bg-neutral-700/50">
                                                    <td className="p-3 font-mono text-sm">{formatDateDisplay(item.clickDate)}</td>
                                                    <td className="p-3 font-semibold text-indigo-300">{item.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-neutral-400 py-4">No clicks recorded in this period.</p>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};


// =======================================================
// THE MODAL COMPONENT (Shorten URL Modal)
// =======================================================
// Note: onClose now accepts a boolean to indicate if a URL was created
const ShortenUrlModal = ({ isOpen, onClose }) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShortUrl('');

    try {
        // 1. Get JWT token from localStorage
        const token = localStorage.getItem('JWT_TOKEN')?.replace(/"/g, '');
        if (!token) throw new Error("You must be logged in to shorten a URL.");

        // 2. Send POST request with Authorization header
        const response = await fetch(SHORTEN_URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Add this!
            },
            body: JSON.stringify({ originalUrl }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to shorten URL.');
        }

        const result = await response.json();
        const fullUrl = CLIENT_BASE_URL + result.shortUrl;
        setShortUrl(fullUrl);

        // Close modal and refresh after a short delay
        setTimeout(() => onClose(true), 1500);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    if (!isOpen) return null;

    return (
        // Modal Backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => onClose(false)} // Pass false on backdrop click
        >
            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} 
                style={{ backgroundColor: THEME.CARD_BG, color: THEME.FOREGROUND }}
                className="w-full max-w-lg p-6 rounded-xl border-2 relative"
            >
                <h2 className="text-2xl font-semibold mb-6 text-indigo-400">Create New Short URL</h2>
                
                {/* Close Button */}
                <button 
                    onClick={() => onClose(false)} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
                >
                    <XIcon />
                </button>

                {/* Shortening Form */}
                {!shortUrl ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label htmlFor="originalUrl" className="block text-neutral-300">
                            Enter Long URL:
                        </label>
                        <input
                            id="originalUrl"
                            type="url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            placeholder="e.g., https://www.a-very-long-url.com/page?id=123"
                            required
                            style={{ 
                                backgroundColor: THEME.BACKGROUND, 
                                color: THEME.FOREGROUND,
                                border: `1px solid ${THEME.BORDER}`
                            }}
                            className="w-full p-3 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: THEME.ACCENT, color: THEME.FOREGROUND }}
                            className="w-full py-3 rounded-md font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Shortening...' : 'Shorten URL'}
                        </button>

                        {error && (
                            <p className="text-red-400 text-sm mt-3">{error}</p>
                        )}
                    </form>
                ) : (
                    // Success Result
                    <div className="mt-4 p-4 bg-green-900/40 border border-green-700 rounded-md">
                        <p className="text-green-300 font-semibold mb-2">✅ URL Shortened Successfully!</p>
                        <p className="text-sm text-neutral-300">Original URL:</p>
                        <p className="text-xs break-all mb-4">{originalUrl}</p>
                        
                        <p className="text-sm text-neutral-300">Short URL:</p>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={shortUrl} 
                                style={{ backgroundColor: THEME.BACKGROUND }}
                                className="w-full p-2 rounded-md text-indigo-300 font-mono break-all"
                            />
                            <button 
                                onClick={() => navigator.clipboard.writeText(shortUrl)}
                                className="bg-indigo-500 text-white p-2 rounded-md text-sm hover:bg-indigo-600"
                            >
                                Copy
                            </button>
                        </div>
                        <button 
                            onClick={() => onClose(false)} 
                            style={{ backgroundColor: THEME.CARD_BG }}
                            className="w-full py-2 mt-4 rounded-md text-neutral-300 hover:text-white border border-neutral-600"
                        >
                            Close
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}; 


// =======================================================
// THE DASHBOARD COMPONENT (Main Content - MODIFIED)
// =======================================================
function Dashboard() {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // STATES FOR USER URL LISTING
  const [userUrls, setUserUrls] = useState([]);
  const [isUrlsLoading, setIsUrlsLoading] = useState(true);
  const [urlsError, setUrlsError] = useState(null);
  
  // NEW STATE: To manage the analytics modal
  const [analyticsUrl, setAnalyticsUrl] = useState(null); // Holds the shortUrl string

  // Use state variables directly (which are formatted strings)
  const { totalClicks, chartData, isLoading, error, refetch } = useTotalClicks(startDate, endDate);

  // --- Utility Handlers ---
  const handleOpenAnalytics = (shortUrl) => {
      setAnalyticsUrl(shortUrl);
  };
  const handleCloseAnalytics = () => {
      setAnalyticsUrl(null);
  };

  const handleModalClose = (refetchNeeded) => {
      setIsModalOpen(false);
      if (refetchNeeded === true) {
          fetchUserUrls(); 
      }
  };


  // --- Data Fetching Logic for User URLs ---
  const fetchUserUrls = useCallback(async () => {
    setIsUrlsLoading(true);
    setUrlsError(null);
    
    // 1. Retrieve the token and clean it
    const token = localStorage.getItem('JWT_TOKEN')?.replace(/"/g, '');
    
    if (!token) {
        setUrlsLoading(false); 
        setUrlsError("Authentication required. Please log in.");
        return; 
    }
    
    try {
      const response = await fetch(MY_URLS_API, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Access Denied: Your session has expired. Please log in.");
        }
        throw new Error(`Failed to fetch user URLs (Status: ${response.status}).`);
      }

      const data = await response.json();
      setUserUrls(data); 
      
    } catch (err) {
      setUrlsError(err.message);
      setUserUrls([]);
    } finally {
      setIsUrlsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchUserUrls();
  }, [fetchUserUrls]);
  // ---------------------------------------------------


  return (
    <div style={{ 
      backgroundColor: THEME.BACKGROUND, 
      color: THEME.FOREGROUND, 
      minHeight: '100vh',
      fontFamily: 'Roboto, sans-serif' 
    }}>
      
      <Header />
      
      {/* Main content container with padding */}
      <div className="pt-20 px-4 md:px-8">
        
        {/* Title and NEW BUTTON added here */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${THEME.ACCENT}`, paddingBottom: '10px', marginBottom: '20px' }}>
             <h1 style={{ fontWeight: 300, margin: 0 }}>
               TinyTrail Clicks Dashboard
             </h1>
             <button
               onClick={() => setIsModalOpen(true)}
               style={{
                 backgroundColor: '#8b5cf6', // A different, bright purple
                 color: THEME.FOREGROUND,
                 padding: '10px 20px',
                 borderRadius: '6px',
                 cursor: 'pointer',
                 fontSize: '16px',
                 fontWeight: 'bold',
                 transition: 'background-color 0.3s',
                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
               }}
               className="hover:bg-purple-600"
             >
               Create New Short URL
             </button>
        </div>
        
        {/* Date Controls & Refresh */}
        <div style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'flex-end',
          padding: '20px 0'
        }}>
          {/* Input controls loop - ACCENT color applied to label and button */}
          {[
            { id: 'startDate', label: 'Start Date', value: startDate, onChange: setStartDate, max: endDate, min: null },
            { id: 'endDate', label: 'End Date', value: endDate, onChange: setEndDate, max: initialEndDate, min: startDate }
          ].map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} style={{ display: 'block', marginBottom: '5px', color: '#a5b4fc' }}> {/* Light Indigo */}
                {field.label}:
              </label>
              <input 
                id={field.id}
                type="date" 
                value={field.value} 
                onChange={(e) => field.onChange(e.target.value)} 
                max={field.max}
                min={field.min}
                style={{
                  backgroundColor: THEME.CARD_BG,
                  color: THEME.FOREGROUND,
                  border: `1px solid ${THEME.BORDER}`,
                  padding: '8px 10px',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
              />
            </div>
          ))}
          
          <button 
            onClick={refetch}
            style={{
              backgroundColor: THEME.ACCENT, // INDIGO BUTTON
              color: THEME.FOREGROUND,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            Refresh Data
          </button>
        </div>

        {/* Loading, Error, and Success States for Clicks Chart */}
        {isLoading && (
          <p style={{ color: THEME.ACCENT }}>📈 Loading Click Data...</p>
        )}

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            border: `1px solid #ff6b6b`, 
            backgroundColor: '#3b2525', 
            padding: '15px', 
            borderRadius: '8px'
          }}>
            <h2>❌ Error Loading Clicks</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Clicks Chart/Total Card (Only shown if clicks data is loaded) */}
        {!isLoading && !error && (
          <>
            {/* Grand Total Card */}
            <div style={{ 
              marginBottom: '40px', 
              borderLeft: `5px solid ${THEME.ACCENT}`, // INDIGO accent border
              backgroundColor: THEME.CARD_BG, 
              padding: '25px', 
              maxWidth: '350px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}>
              <p style={{ margin: 0, fontSize: '0.9em', color: '#a5b4fc' }}> {/* Light Indigo */}
                Range: {formatDateDisplay(startDate)} to {formatDateDisplay(endDate)}
              </p>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '2.5em', fontWeight: 500 }}>
                {totalClicks !== null ? totalClicks.toLocaleString() : 'N/A'}
              </h2>
              <p style={{ margin: 0, fontSize: '1em', color: '#aaaaaa' }}>TOTAL CLICKS</p>
            </div>

            {/* Chart Integration */}
            {/* Chart Integration */}
<div style={{ 
    marginTop: '40px', 
    backgroundColor: THEME.CARD_BG, 
    padding: '20px', 
    borderRadius: '8px', 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    minHeight: '300px'
}}>
    <h3 style={{ marginBottom: '20px', color: '#a5b4fc', fontWeight: 400 }}>Click Trend by Date</h3>
    {chartData && chartData.length > 0 ? (
        <ClicksChart data={chartData} theme={THEME} />
    ) : (
        <p style={{ color: '#aaa', textAlign: 'center' }}>No click data found for this period.</p>
    )}
</div>
          </>
        )}
        
        {/* =======================================================
           User URL Listing Section
           ======================================================= */}
        <h2 style={{ color: THEME.ACCENT, fontSize: '1.5em', fontWeight: 500, marginTop: '50px', borderBottom: `1px solid ${THEME.BORDER}`, paddingBottom: '10px' }}>
            My Shortened URLs
        </h2>
        
        {isUrlsLoading && (
            <p className="text-lg text-indigo-400 mt-4">🔄 Loading your URLs...</p>
        )}

        {urlsError && (
            <div className="text-red-400 bg-red-900/40 p-4 rounded-lg mt-4">
                <p>⚠️ Error fetching URLs: {urlsError}</p>
                <button onClick={fetchUserUrls} className="text-sm mt-2 text-red-300 hover:underline">
                    Try Reloading
                </button>
            </div>
        )}

        {!isUrlsLoading && !urlsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pb-10">
            {userUrls.length > 0 ? (
                userUrls.map(url => (
                    <UrlCard 
                        key={url.id} 
                        url={url} 
                        theme={THEME} 
                        onAnalyticsClick={handleOpenAnalytics} // Pass the handler
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-lg text-neutral-400 py-8">
                    You haven't shortened any URLs yet.
                </p>
            )}
          </div>
        )}

      </div>
      
      {/* NEW MODAL INTEGRATION: Shorten URL Modal */}
      <AnimatePresence>
        {isModalOpen && (
             <ShortenUrlModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </AnimatePresence>
      
      {/* NEW MODAL INTEGRATION: Analytics Modal */}
      <AnimatePresence>
        {analyticsUrl && (
             <AnalyticsModal shortUrl={analyticsUrl} onClose={handleCloseAnalytics} />
        )}
      </AnimatePresence>
      
    </div>
  );
}

export default Dashboard;