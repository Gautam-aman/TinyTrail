import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom'; // <-- IMPORT Link & useNavigate
import { useStoreContext } from "../api/ ContextApi"; // <-- IMPORT CONTEXT

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

// --- Header Component (MODIFIED) ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [ { name: 'Home', href: '/' }, { name: 'About', href: '/about' } ];

    // --- ADDED: Context and Navigation hooks ---
    const { token, logout } = useStoreContext();
    const navigate = useNavigate();

    // --- ADDED: Logout handler ---
    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* --- UPDATED to <Link> --- */}
                <Link to="/" className="flex items-center">
                    <Logo />
                    <span className="text-2xl font-bold text-white ml-2">TinyTrail</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                         // --- UPDATED to <Link> ---
                         <Link key={link.name} to={link.href} className="text-slate-300 hover:text-indigo-400 transition-colors">
                            {link.name}
                         </Link>
                    ))}
                    
                    {/* --- ADDED: Conditional Auth Button --- */}
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
                             // --- UPDATED to <Link> ---
                             <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 text-lg hover:text-indigo-400 transition-colors">
                                {link.name}
                             </Link>
                        ))}

                        {/* --- ADDED: Conditional Auth Button (Mobile) --- */}
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

// --- (Rest of the file is unchanged) ---

const features = [
  { title: "Instant Shortening", desc: "Shorten long URLs instantly." },
  { title: "Custom Aliases", desc: "Create memorable custom URLs." },
  { title: "Analytics", desc: "Track clicks and engagement." },
  { title: "Secure & Reliable", desc: "Safe links with high uptime." },
];

const CanvasParticles = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: null, y: null });
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let animationFrameId;
        const handleMouseMove = (event) => { mouse.current.x = event.clientX; mouse.current.y = event.clientY; };
        window.addEventListener('mousemove', handleMouseMove);
        const resizeCanvas = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        window.addEventListener('resize', resizeCanvas); resizeCanvas();
        let shootingStars = [];
        const createShootingStar = () => { if (mouse.current.x !== null) { shootingStars.push({ x: mouse.current.x, y: mouse.current.y, radius: Math.random() * 1.5 + 1, speed: Math.random() * 3 + 2, trailLength: Math.random() * 20 + 15, angle: Math.random() * Math.PI * 2, ttl: 80, }); } };
        const starInterval = setInterval(createShootingStar, 50);
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            shootingStars.forEach((star, index) => {
                const vx = Math.cos(star.angle) * star.speed; const vy = Math.sin(star.angle) * star.speed;
                const trailStartX = star.x - vx * star.trailLength; const trailStartY = star.y - vy * star.trailLength;
                const opacity = (star.ttl / 80); const gradient = ctx.createLinearGradient(trailStartX, trailStartY, star.x, star.y);
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);
                ctx.strokeStyle = gradient; ctx.lineWidth = star.radius; ctx.beginPath();
                ctx.moveTo(trailStartX, trailStartY); ctx.lineTo(star.x, star.y); ctx.stroke();
                star.x += vx; star.y += vy; star.ttl--;
                if (star.ttl <= 0) { shootingStars.splice(index, 1); }
            });
            animationFrameId = window.requestAnimationFrame(animate);
        };
        animate();
        return () => { window.cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resizeCanvas); window.removeEventListener('mousemove', handleMouseMove); clearInterval(starInterval); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />;
};


// --- About Page Component ---
const About = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-black text-white overflow-x-hidden">
        <Header />
        <CanvasParticles />

        <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 w-full">
            <motion.h1
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-lg"
            >
                About TinyTrail
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                className="text-lg text-gray-300 max-w-3xl text-center mb-12"
            >
                TinyTrail is a futuristic URL shortening platform. Transform long links into sleek, shareable URLs with analytics, speed, and style.
            </motion.p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-purple-400 mb-10 drop-shadow-md">Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.08, y: -5 }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-white/10 backdrop-blur-md border border-purple-400/30 p-6 rounded-3xl shadow-lg cursor-pointer transition-shadow duration-200 hover:shadow-[0px_10px_30px_rgba(128,90,213,0.4)]"
                    >
                        <h3 className="text-2xl font-bold mb-2 text-purple-300 drop-shadow-md">{feature.title}</h3>
                        <p className="text-gray-200">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mt-16 bg-white/10 backdrop-blur-md border border-indigo-400/30 p-8 md:p-12 rounded-3xl max-w-4xl text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-indigo-300 drop-shadow-md">Our Mission</h2>
                <p className="text-gray-200 text-lg">
                    Our mission is to revolutionize link sharing with a futuristic cosmic experience. TinyTrail makes URLs sleek, trackable, and immersive.
                </p>
            </motion.div>
        </main>

        <footer className="w-full bg-slate-900/50 border-t border-slate-800 mt-auto">
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
  );
};

export default About;