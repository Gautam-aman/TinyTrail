import React, { useState } from 'react';
import { useTotalClicks, getFormattedDate } from './../../hooks/useTotalClicks'; 
import ClicksChart from './ClicksChart'; 
import { motion, AnimatePresence } from 'framer-motion'; 

// --- ICON DUMMIES (Required for Header) ---
const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>);
const XIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>);
const Logo = () => (<span className="text-indigo-400 text-3xl">🔗</span>); 
// ------------------------------------------------------------------------------------------------

// --- THEME COLORS (Unified with Header) ---
const THEME = {
  BACKGROUND: '#1e1e1e',
  FOREGROUND: '#ffffff', 
  ACCENT: '#4f46e5',     // Indigo 600
  CARD_BG: '#2d2d2d',    
  BORDER: '#444444',
};

// ... (Helper functions remain the same) ...
const today = new Date();
const initialEndDate = getFormattedDate(today);
today.setDate(1); 
const initialStartDate = getFormattedDate(today);

const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
};

// =======================================================
// THE HEADER COMPONENT (Your provided Tailwind component)
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


// =======================================================
// THE DASHBOARD COMPONENT (Main Content)
// =======================================================
function Dashboard() {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const { totalClicks, chartData, isLoading, error, refetch } = useTotalClicks(startDate, endDate);

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
        <h1 style={{ borderBottom: `2px solid ${THEME.ACCENT}`, paddingBottom: '10px', fontWeight: 300 }}>
          TinyTrail Clicks Dashboard
        </h1>
        
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

        {/* Loading, Error, and Success States */}
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
            <div style={{ marginTop: '40px', backgroundColor: THEME.CARD_BG, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
                <h3 style={{ marginBottom: '20px', color: '#a5b4fc', fontWeight: 400 }}>Click Trend by Date</h3>
                {chartData && chartData.length > 0 ? (
                    <ClicksChart data={chartData} theme={THEME} />
                ) : (
                    <p style={{ color: '#aaa', textAlign: 'center' }}>No click data found for this period.</p>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;