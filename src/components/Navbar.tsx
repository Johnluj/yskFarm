import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Phone } from 'lucide-react';
import { NAV_ITEMS, CONTACT_INFO } from '../constants';
import { ChickenLogo } from './ChickenLogo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'h-16 bg-white shadow-sm border-b border-slate-100' : 'h-20 bg-transparent'
      } flex items-center`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#064e3b] rounded-lg flex items-center justify-center">
              <ChickenLogo headColorClass="text-white" className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-extrabold text-lg tracking-tight uppercase leading-none transition-colors duration-300 ${isScrolled ? 'text-primary-900' : 'text-white'}`}>YSJ Farm Limited</span>
              <span className={`text-[9px] uppercase tracking-[0.2em] font-bold mt-0.5 transition-colors duration-300 ${isScrolled ? 'text-primary-600' : 'text-primary-200'}`}>Commercial Supply</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-bold uppercase tracking-wider transition-all transition-colors duration-300 ${
                  location.pathname === item.href
                    ? 'text-primary-900 border-b-2 border-accent-400 pb-1'
                    : isScrolled ? 'text-slate-600 hover:text-primary-800' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-primary-900 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary-800 transition-all shadow-md active:scale-95"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-300 ${isScrolled ? 'text-primary-900' : 'text-white'}`}
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${
                    location.pathname === item.href
                      ? 'text-primary-900 bg-primary-50 border-l-4 border-accent-400'
                      : 'text-slate-600 hover:text-primary-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                </Link>
              ))}
              <div className="pt-6 px-2">
                <Link
                  to="/contact"
                  className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Phone className="w-4 h-4" />
                  Request Poultry Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
