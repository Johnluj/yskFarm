import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isFirebaseConfigured } from '../../lib/firebase';
import { getFirebaseReports, getFirebaseBatches, saveFirebaseReport } from '../../lib/firebaseService';
import { DailyReport, Batch } from '../../types/admin';
import { format } from 'date-fns';
import { getLocalReports, saveLocalReport, getLocalBatches } from '../../lib/dbFallback';

export const DailyReports: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReport, setNewReport] = useState({
    batch_id: '',
    feed_consumed: 0,
    mortality: 0,
    medication: '',
    observations: '',
    report_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchData = async () => {
    try {
      let loadedReports = null;
      let loadedBatches = null;

      if (isFirebaseConfigured) {
        const [fbReports, fbBatches] = await Promise.all([
          getFirebaseReports(),
          getFirebaseBatches()
        ]);
        if (fbReports && fbBatches) {
          loadedBatches = fbBatches.filter(b => b.status === 'active');
          loadedReports = fbReports.map(r => ({
            ...r,
            batches: { name: fbBatches.find(b => b.id === r.batch_id)?.name || 'Unknown Batch' }
          }));
        }
      } else if (supabase) {
        const [reportsRes, batchesRes] = await Promise.all([
          supabase.from('daily_reports').select('*, batches(name)').order('report_date', { ascending: false }),
          supabase.from('batches').select('id, name').eq('status', 'active')
        ]);
        
        if (!reportsRes.error && reportsRes.data) {
          loadedReports = reportsRes.data;
        }
        if (!batchesRes.error && batchesRes.data) {
          loadedBatches = batchesRes.data;
        }
      }

      if (loadedReports && loadedBatches) {
        setReports(loadedReports as any);
        setBatches(loadedBatches);
      } else {
        const localBatches = getLocalBatches();
        const activeLocalBatches = localBatches.filter(b => b.status === 'active');
        const localReports = getLocalReports().map(r => ({
          ...r,
          batches: { name: localBatches.find(b => b.id === r.batch_id)?.name || 'Unknown Batch' }
        }));
        setReports(localReports as any);
        setBatches(activeLocalBatches);
      }
    } catch (err) {
      console.error('Error fetching daily reports, using fallback:', err);
      const localBatches = getLocalBatches();
      const activeLocalBatches = localBatches.filter(b => b.status === 'active');
      const localReports = getLocalReports().map(r => ({
        ...r,
        batches: { name: localBatches.find(b => b.id === r.batch_id)?.name || 'Unknown Batch' }
      }));
      setReports(localReports as any);
      setBatches(activeLocalBatches);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let success = false;

      if (isFirebaseConfigured) {
        await saveFirebaseReport({
          batch_id: newReport.batch_id,
          feed_consumed: newReport.feed_consumed,
          mortality: newReport.mortality,
          medication: newReport.medication,
          observations: newReport.observations,
          report_date: newReport.report_date
        });
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('daily_reports')
          .insert(newReport);

        if (!error) {
          success = true;
        } else {
          console.warn('Supabase daily_reports insert failed, using fallback:', error.message);
        }
      }

      if (!success) {
        saveLocalReport({
          batch_id: newReport.batch_id,
          feed_consumed: newReport.feed_consumed,
          mortality: newReport.mortality,
          medication: newReport.medication,
          observations: newReport.observations,
          report_date: newReport.report_date
        });
      }
      
      setIsModalOpen(false);
      setNewReport({
        batch_id: '',
        feed_consumed: 0,
        mortality: 0,
        medication: '',
        observations: '',
        report_date: format(new Date(), 'yyyy-MM-dd')
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-ink-900 tracking-tighter">Daily Operations</h1>
          <p className="text-slate-500 text-sm font-medium mt-3">Precision logging for feed consumption, health metrics and flock analytics.</p>
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-ink-900 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-black/10 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 text-primary-400" />
          New Daily Log
        </button>
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">New Daily Log</h2>
              <p className="text-sm text-slate-500 mb-8">Record activities for a specific batch.</p>

              <form onSubmit={handleCreateReport} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Select Batch</label>
                  <select 
                    required
                    value={newReport.batch_id}
                    onChange={(e) => setNewReport({...newReport, batch_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Choose a batch...</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Feed (KG)</label>
                    <input 
                      required
                      type="number" step="0.1"
                      placeholder="0.0"
                      value={newReport.feed_consumed || ''}
                      onChange={(e) => setNewReport({...newReport, feed_consumed: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Mortality</label>
                    <input 
                      required
                      type="number"
                      placeholder="0"
                      value={newReport.mortality || ''}
                      onChange={(e) => setNewReport({...newReport, mortality: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Medication Given</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Vitamin A, Gumboro Vac"
                    value={newReport.medication}
                    onChange={(e) => setNewReport({...newReport, medication: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Observations</label>
                  <textarea 
                    rows={3}
                    placeholder="Any abnormalities or general notes..."
                    value={newReport.observations}
                    onChange={(e) => setNewReport({...newReport, observations: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  disabled={isSubmitting || !newReport.batch_id}
                  className="w-full bg-[#fbbf24] text-[#064e3b] font-bold py-5 rounded-2xl hover:bg-[#f59e0b] transition-all shadow-xl shadow-yellow-500/20 active:scale-95 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Saving Log...' : 'Submit Daily Report'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-[#fafafa]">
          <div>
            <h3 className="font-display font-bold text-xl text-ink-900">Historical Records</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Sequential synchronization active</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all"><Filter className="w-5 h-5" /></button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all"><Search className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Log Date</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Batch Identifier</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Feed Int. (KG)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Mortality</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Medication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing logs...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vault empty: No records found</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8 text-sm font-bold text-ink-900 font-mono italic">{format(new Date(report.report_date), 'MMM dd, yyyy')}</td>
                    <td className="px-10 py-8">
                       <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">
                         {(report as any).batches?.name}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-ink-900 text-center font-mono tracking-tighter">{report.feed_consumed}</td>
                    <td className="px-10 py-8 text-center">
                      <span className={`text-sm font-black font-mono ${report.mortality > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {report.mortality}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {report.medication ? (
                        <span className="px-4 py-2 bg-primary-950 text-primary-400 text-[10px] font-black rounded-xl uppercase tracking-[0.15em] border border-white/10">
                          {report.medication}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">None</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
