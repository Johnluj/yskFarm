import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Wrench,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isFirebaseConfigured } from '../../lib/firebase';
import { getFirebaseLogs, saveFirebaseLog, resetAllFirebaseData } from '../../lib/firebaseService';
import { MaintenanceLog } from '../../types/admin';
import { format } from 'date-fns';
import { useAuth } from '../../components/admin/AuthGuard';
import { getLocalLogs, saveLocalLog, resetAllLocalData } from '../../lib/dbFallback';

export const Maintenance: React.FC = () => {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLog, setNewLog] = useState({
    item_name: '',
    activity: '',
    cost: 0,
    log_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchData = async () => {
    try {
      if (isFirebaseConfigured) {
        const firestoreLogs = await getFirebaseLogs();
        if (firestoreLogs) {
          setLogs(firestoreLogs);
          return;
        }
      } else if (supabase) {
        const { data, error } = await supabase
          .from('maintenance_logs')
          .select('*')
          .order('log_date', { ascending: false });

        if (!error && data) {
          setLogs(data);
          return;
        }
        if (error) console.warn('Supabase maintenance fetch error, using fallback:', error.message);
      }
      setLogs(getLocalLogs());
    } catch (err) {
      console.error('Error fetching maintenance, using fallback:', err);
      setLogs(getLocalLogs());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let success = false;

      if (isFirebaseConfigured) {
        await saveFirebaseLog({
          item_name: newLog.item_name,
          activity: newLog.activity,
          cost: newLog.cost,
          log_date: newLog.log_date
        });
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('maintenance_logs')
          .insert(newLog);

        if (!error) {
          success = true;
        } else {
          console.warn('Supabase maintenance insert failed, using fallback:', error.message);
        }
      }

      if (!success) {
        saveLocalLog({
          item_name: newLog.item_name,
          activity: newLog.activity,
          cost: newLog.cost,
          log_date: newLog.log_date
        });
      }
      
      setIsModalOpen(false);
      setNewLog({
        item_name: '',
        activity: '',
        cost: 0,
        log_date: format(new Date(), 'yyyy-MM-dd')
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error recording maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetData = async () => {
    try {
      setIsSubmitting(true);
      let success = false;

      if (isFirebaseConfigured) {
        await resetAllFirebaseData();
        success = true;
      } else if (supabase) {
        try {
          const tables = ['maintenance_logs', 'sales_ledger', 'daily_reports', 'batches'];
          for (const table of tables) {
            await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          }
          success = true;
        } catch (dbErr) {
          console.warn('Failed selective Supabase delete, resetting locally:', dbErr);
        }
      }

      resetAllLocalData();
      alert('Data reset successfully');
      setIsResetModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error resetting data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMaintenanceCost = logs.reduce((acc, curr) => acc + Number(curr.cost), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-ink-900 tracking-tighter">Maintenance</h1>
          <p className="text-slate-500 text-sm font-medium mt-3">Facility upkeep logs and systematic asset management protocols.</p>
          <div className="mt-4 flex gap-2 flex-wrap items-center">
            {isFirebaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-600/10 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-600/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Active (Firestore Realtime)
              </span>
            ) : isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-600/10 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-600/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Offline Sandbox (LocalStorage)
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          {isAdmin && (
            <>
              <button 
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-3 bg-red-50 text-red-600 font-black px-6 py-5 rounded-2xl transition-all hover:bg-red-100 active:scale-95 text-[10px] uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" />
                Reset System
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 bg-ink-900 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-black/10 active:scale-95 text-xs uppercase tracking-widest"
              >
                <Plus className="w-5 h-5 text-primary-400" />
                New Log Entry
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary-50 transition-colors duration-500">
            <Wrench className="w-8 h-8 text-slate-400 group-hover:text-primary-600" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 px-1">Fiscal Upkeep Expenditure</p>
            <h3 className="text-3xl font-display font-black text-ink-900 leading-none tracking-tight">
              <span className="font-mono italic">₦{totalMaintenanceCost.toLocaleString()}</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
            <Search className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 px-1">Protocol Entries</p>
            <h3 className="text-3xl font-display font-black text-ink-900 leading-none tracking-tight">
              <span className="font-mono text-blue-600">{logs.length}</span>
            </h3>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">New Maintenance Record</h2>
              <p className="text-sm text-slate-500 mb-8">Log repair or service activity.</p>

              <form onSubmit={handleCreateLog} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Asset Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Deep Freezer #2"
                    value={newLog.item_name}
                    onChange={(e) => setNewLog({...newLog, item_name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Activity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Gas Refill & Compressor Check"
                    value={newLog.activity}
                    onChange={(e) => setNewLog({...newLog, activity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Cost (₦)</label>
                    <input 
                      required
                      type="number" 
                      value={newLog.cost || ''}
                      onChange={(e) => setNewLog({...newLog, cost: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Date</label>
                    <input 
                      required
                      type="date" 
                      value={newLog.log_date}
                      onChange={(e) => setNewLog({...newLog, log_date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#064e3b] text-white font-bold py-5 rounded-2xl hover:bg-[#053c2e] transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                >
                  {isSubmitting ? 'Recording...' : 'Save Maintenance Log'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isResetModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Reset All Data?</h2>
              <p className="text-sm text-slate-500 mb-8">This will permanently delete all batches, sales, reports, and maintenance logs. This action cannot be undone.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleResetData}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Resetting...' : 'Yes, Delete Everything'}
                </button>
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm mt-10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Maintenance Date</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Asset</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Task Activity</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Incurred Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving maintenance archives...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No infrastructure logs present</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8 text-sm font-bold text-ink-900 font-mono italic">{format(new Date(log.log_date), 'MMM dd, yyyy')}</td>
                  <td className="px-10 py-8 text-sm font-black text-ink-900 leading-none">{log.item_name}</td>
                  <td className="px-10 py-8">
                     <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       {log.activity}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-right font-black text-ink-900 text-base font-mono tracking-tighter italic">
                    ₦{Number(log.cost).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
