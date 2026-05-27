import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Layers, 
  FileText, 
  Wallet, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  Hammer,
  Home
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ChickenLogo } from '../../components/ChickenLogo';
import { Preloader } from '../../components/Preloader';

const MENU_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { label: 'Bird Batches', icon: Layers, href: '/admin/batches' },
  { label: 'Daily Reports', icon: FileText, href: '/admin/reports' },
  { label: 'Sales Ledger', icon: Wallet, href: '/admin/sales' },
  { label: 'Maintenance', icon: Hammer, href: '/admin/maintenance' },
  { label: 'Staff Directory', icon: Users, href: '/admin/staff' },
];

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Clear sandbox local flags
      localStorage.removeItem('ysj_sandbox_mode');
      localStorage.removeItem('ysj_sandbox_session');
      
      // 2. Firebase sign out
      const { auth } = await import('../../lib/firebase');
      if (auth) {
        await auth.signOut();
      }
    } catch (e) {
      console.warn("Firebase signout warning or suppressed:", e);
    }

    try {
      // 3. Supabase sign out
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn("Supabase signout warning or suppressed:", e);
    }

    window.sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex text-ink-900">
      <Preloader />
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-ink-900 text-white z-50 transition-all duration-500 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-white/5 shadow-2xl`}
      >
        <div className="h-full flex flex-col pt-10 pb-8 px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="w-12 h-12 bg-primary-950 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-black/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChickenLogo headColorClass="text-white" className="w-8 h-8 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl leading-none tracking-tight">YSJ SUITE</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Farm Management</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Main Menu</p>
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-white/5 text-white font-semibold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-6 bg-primary-400 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-600 group-hover:text-slate-300'}`} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Settings & Account */}
          <div className="mt-8 pt-8 border-t border-white/5 space-y-1">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">System</p>
             <Link
              to="/"
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
            >
              <Home className="w-5 h-5 text-slate-600 group-hover:text-emerald-400/60" />
              <span className="text-sm tracking-tight font-bold">Back to Homepage</span>
            </Link>
             <button
              onClick={() => navigate('/admin/staff')}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Settings className="w-5 h-5 text-slate-600 group-hover:text-slate-300" />
              <span className="text-sm tracking-tight">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
            >
              <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-400/60" />
              <span className="text-sm tracking-tight">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-slate-100/50 border border-transparent focus:border-slate-200 focus:bg-white rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-primary-500/5 outline-none w-80 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:text-[#064e3b] hover:border-[#064e3b]/30 transition-all font-bold text-xs"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </Link>

            <div className="flex items-center gap-2">
               <button className="p-3 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
              </button>
            </div>
            
            <div className="h-10 w-px bg-slate-100 hidden sm:block" />
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-black text-ink-900 leading-none">YSJ Administrator</p>
                <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.15em] mt-1">Super Admin Role</p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border border-primary-200/50 shadow-sm group-hover:shadow-md transition-all">
                  <Users className="w-6 h-6 text-primary-950" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="flex-1 p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
