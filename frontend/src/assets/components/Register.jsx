import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import api from '../api/api';

// --- Helper Icon and Loader Components ---
const Logo = () => (
  <svg height="32" width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
  </svg>
);
const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);
const Loader = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Header Component ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [ { name: 'Home', href: '#' }, { name: 'About', href: '#' } ];
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <a href="#" className="flex items-center"><Logo /><span className="text-2xl font-bold text-white ml-2">TinyTrail</span></a>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (<a key={link.name} href={link.href} className="text-slate-300 hover:text-indigo-400 transition-colors">{link.name}</a>))}
                    <a href="#" className="py-2 px-5 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">Sign Up</a>
                </nav>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-indigo-400 z-50">{isOpen ? <XIcon /> : <MenuIcon />}</button>
            </div>
            <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.3 }} className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800">
                    <nav className="flex flex-col items-center space-y-4 py-8">
                         {navLinks.map(link => (<a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-300 text-lg hover:text-indigo-400 transition-colors">{link.name}</a>))}
                        <a href="#" className="py-3 px-7 rounded-lg font-semibold text-base bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all">Sign Up</a>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

// --- Main Authentication Page Component ---
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // New state for loading and feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setUsername('');
    setEmail('');
    setPassword('');
    setError(null); // Clear errors on mode switch
    setSuccessMessage(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await api.post('/api/auth/public/login', {
          username,
          password,
        });
        console.log('Login successful:', response.data);
        localStorage.setItem("JWT_TOKEN" , JSON.stringify(response.token));
        console.log(response.token);
        setSuccessMessage('Login successful! Redirecting...');
        // Handle successful login (e.g., redirect, save token)
        // window.location.href = '/dashboard';

      } else {
        // --- SIGNUP LOGIC ---
        const response = await api.post('/api/auth/public/register', {
          username,
          email,
          password,
        });
        console.log('Registration successful:', response.data);
        setSuccessMessage('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login mode after successful registration
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Variants for animations
  const formVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const inputContainerVariants = { exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } }, enter: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } } };
  const feedbackVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };


  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans px-4 pt-24 pb-8">
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700">
          
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h2 key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="text-3xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </motion.h2>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div variants={feedbackVariants} initial="hidden" animate="visible" exit="hidden" className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative text-center text-sm flex items-center justify-center">
                <FiAlertCircle className="mr-2"/> {error}
              </motion.div>
            )}
            {successMessage && (
               <motion.div variants={feedbackVariants} initial="hidden" animate="visible" exit="hidden" className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg relative text-center text-sm">
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={submitHandler}>
            {/* Form fields... */}
            <div className="relative">
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Username" disabled={isLoading} className="w-full p-3 pl-10 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <AnimatePresence>
              {!isLogin && (<motion.div key="email-input" variants={inputContainerVariants} initial="exit" animate="enter" exit="exit" className="relative overflow-hidden">
                <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Email Address" disabled={isLoading} className="w-full p-3 pl-10 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </motion.div>)}
            </AnimatePresence>
            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Password" disabled={isLoading} className="w-full p-3 pl-10 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full px-5 py-3 font-semibold text-center text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:outline-none focus:ring-blue-800 shadow-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? <Loader /> : (isLogin ? 'Login' : 'Create Account')}
              </motion.button>
            </div>
            
            <p className="text-sm text-center text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button type="button" onClick={switchModeHandler} className="ml-2 font-medium text-blue-500 hover:underline disabled:opacity-50" disabled={isLoading}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AuthForm;
