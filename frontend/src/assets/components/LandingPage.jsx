import React, { useState } from 'react'; // <-- FIXED
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreContext } from '../api/ ContextApi';



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

// --- Header Component ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    // --- UPDATED NAVIGATION LINKS ---
    const navLinks = [
        { name: 'Home', href: '/' },          // Changed from '#home'
        { name: 'About', href: '/about' },    // Changed from '#features'
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
                    <a href="/register" className="py-2 px-5 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                        Sign Up
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
                        <a href="#" className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">
                            Sign Up
                        </a>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};
           


const LandingPage = () => {
    const sectionAnimation = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        viewport: { once: true },
    };

    const { token } = useStoreContext();
    console.log("Token from landing page: ", token);
    
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
                                    <a href="/dashboard" className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                                        Manage Links
                                    </a>
                                    <a href="#" className="py-3 px-7 rounded-lg font-semibold text-base text-indigo-400 bg-transparent border-2 border-slate-600 hover:bg-slate-800 transition-colors">
                                        Create Short Link
                                    </a>
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
        </div>
    )
}

export default LandingPage;