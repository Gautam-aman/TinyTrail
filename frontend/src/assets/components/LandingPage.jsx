import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreContext } from '../api/ ContextApi';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Icon Components ---
const Logo = ({ className = 'h-8 w-auto' }) => (
  <svg className={className} viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H12C15.3137 12 18 9.31371 18 6V6" stroke="#818cf8" strokeWidth="5" strokeLinecap="round"/>
    <path d="M3 12H12C15.3137 12 18 14.6863 18 18V18" stroke="#818cf8" strokeWidth="5" strokeLinecap="round"/>
    <path d="M41 12H32C28.6863 12 26 9.31371 26 6V6" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round"/>
    <path d="M41 12H32C28.6863 12 26 14.6863 26 18V18" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round"/>
    <title>TinyTrail</title>
  </svg>
);

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
);

const XIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

// --- ADDED: API Endpoints ---
const SHORTEN_URL_API = 'http://localhost:8080/api/urls/shorten';
const CLIENT_BASE_URL = 'http://localhost:8080/';

// --- ADDED: THEME COLORS (Needed for Modal) ---
const THEME = {
  BACKGROUND: '#1e1e1e',
  FOREGROUND: '#ffffff', 
  ACCENT: '#4f46e5',     // Indigo 600
  CARD_BG: '#2d2d2d',    
  BORDER: '#444444',
};

// --- Data for Features ---
const featuresData = [
  {
    title: 'Simple URL Shortening',
    description: 'Experience the ease of creating short, memorable URLs in just a few clicks. Our intuitive interface and quick setup process.',
  },
  {
    title: 'Powerful Analytics',
    description: 'Gain insights into your link performance with our comprehensive analytics dashboard. Track clicks, geographical data, and referral sources.',
  },
  {
    title: 'Enhanced Security',
    description: 'Rest assured with our robust security measures. All shortened URLs are protected with advanced encryption, ensuring your data remains safe.',
  },
  {
    title: 'Fast and Reliable',
    description: 'Enjoy lightning-fast redirects and high uptime with our reliable infrastructure. Your shortened URLs will always be available and responsive.',
  },
];

// --- Reusable Feature Card Component ---
const FeatureCard = ({ title, description }) => (
    <motion.div
        className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
    >
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </motion.div>
);

// --- Header Component (Unchanged from your last version) ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { token, logout } = useStoreContext();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
    ];

    const handleLogout = () => {
        logout(); 
        setIsOpen(false); 
        navigate('/'); 
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Logo />
                    <span className="text-2xl font-bold text-white ml-2">TinyTrail</span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                         <Link key={link.name} to={link.href} className="text-slate-300 hover:text-indigo-400 transition-colors">
                            {link.name}
                         </Link>
                    ))}
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="py-2 px-5 rounded-lg font-semibold text-base bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <Link to="/register" className="py-2 px-5 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                            Sign Up
                        </Link>
                    )}
                </nav>

                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-indigo-400 z-50">
                    {isOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>
            
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
                             <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 text-lg hover:text-indigo-400 transition-colors">
                                {link.name}
                             </Link>
                        ))}
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="py-3 px-7 rounded-lg font-semibold text-base bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/register" onClick={() => setIsOpen(false)} className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">
                                Sign Up
                            </Link>
                        )}
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};
           

// --- ADDED: Shorten URL Modal (Copied from Dashboard) ---
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
        const token = localStorage.getItem('JWT_TOKEN');
        if (!token) throw new Error("You must be logged in to shorten a URL.");

        // 2. Send POST request with Authorization header
        const response = await fetch(SHORTEN_URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
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
        setTimeout(() => onClose(true), 10000);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => onClose(false)}
        >
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
                
                <button 
                    onClick={() => onClose(false)} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
                >
                    <XIcon />
                </button>

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


// --- Landing Page Component ---
const LandingPage = () => {
    const sectionAnimation = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        viewport: { once: true },
    };

    const { token } = useStoreContext();
    
    // --- ADDED: Modal state and handlers ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // refetchNeeded is part of the modal's original callback, but we don't
    // need to do anything with it here, so we just close the modal.
    const handleModalClose = (refetchNeeded) => {
        setIsModalOpen(false);
    };
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    return (
        <div className="bg-slate-900 text-slate-300 font-sans antialiased">
            <Header /> 

            <main>
                {/* --- Hero Section --- */}
                <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-24">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-10 items-center">
                            <motion.div 
                                className="flex justify-center md:order-last"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <img 
                                    src="https://d19fbfhz0hcvd2.cloudfront.net/PR/wp-content/uploads/2016/09/10_UsingURLShorteners.jpg" 
                                    alt="URL Shortener Analytics Graphic" 
                                    className="rounded-lg max-w-sm md:max-w-md shadow-2xl"
                                />
                            </motion.div>
                            <motion.div 
                                className="text-center md:text-left"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                                    TinyTrail Simplifies URL Shortening For Efficient Sharing
                                </h1>
                                <p className="text-lg text-slate-400 max-w-xl mx-auto md:mx-0 mb-8">
                                    TinyTrail streamlines the process of URL shortening, making sharing links effortless and efficient. With its user-friendly interface, TinyTrail allows you to generate concise, easy-to-share URLs in seconds.
                                </p>
                                <div className="flex justify-center md:justify-start gap-4">
                                    
                                    <Link 
                                        to={token ? "/dashboard" : "/register"} 
                                        className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Manage Links
                                    </Link>
                                    
                                    {/* === MODIFIED: Conditional Button/Link === */}
                                    {token ? (
                                        <button
                                            onClick={handleOpenModal}
                                            className="py-3 px-7 rounded-lg font-semibold text-base text-indigo-400 bg-transparent border-2 border-slate-600 hover:bg-slate-800 transition-colors"
                                        >
                                            Create Short Link
                                        </button>
                                    ) : (
                                        <Link
                                            to="/register"
                                            className="py-3 px-7 rounded-lg font-semibold text-base text-indigo-400 bg-transparent border-2 border-slate-600 hover:bg-slate-800 transition-colors"
                                        >
                                            Create Short Link
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* --- Trusted By Section --- */}
                <motion.section {...sectionAnimation} className="py-12">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-xl font-semibold text-slate-400">
                            Trusted by individuals and teams at the world's best companies
                        </h2>
                    </div>
                </motion.section>

                {/* --- Features Section --- */}
                <section id="features" className="py-16 md:py-24 bg-slate-950">
                    <div className="container mx-auto px-6">
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ staggerChildren: 0.15 }}
                        >
                            {featuresData.map((feature, index) => (
                                <motion.div key={index} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 }}}>
                                    <FeatureCard title={feature.title} description={feature.description} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Logo className="h-7 w-auto"/>
                            <span className="text-xl font-bold text-white ml-2">TinyTrail</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} TinyTrail. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            
            {/* --- ADDED: Modal Integration --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <ShortenUrlModal isOpen={isModalOpen} onClose={handleModalClose} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default LandingPage;