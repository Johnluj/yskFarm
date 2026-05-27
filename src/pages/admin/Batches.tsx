import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isFirebaseConfigured } from '../../lib/firebase';
import { getFirebaseBatches, saveFirebaseBatch, updateFirebaseBatchStatus } from '../../lib/firebaseService';
import { Batch } from '../../types/admin';
import { format } from 'date-fns';
import { useAuth } from '../../components/admin/AuthGuard';
import { getLocalBatches, saveLocalBatch, updateLocalBatchStatus } from '../../lib/dbFallback';

export const Batches: React.FC = () => {
  const { isAdmin } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    breed: 'broilers',
    initial_quantity: 0,
    initial_feed_qty: 0,
    stocking_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchBatches = async () => {
    try {
      if (isFirebaseConfigured) {
        const firestoreBatches = await getFirebaseBatches();
        if (firestoreBatches) {
          setBatches(firestoreBatches);
          return;
        }
      } else if (supabase) {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setBatches(data);
          return;
        }
        if (error) {
          console.warn('Supabase batches fetch error, using local fallback:', error.message);
        }
      }
      setBatches(getLocalBatches());
    } catch (err) {
      console.error('Error fetching batches, using fallback:', err);
      setBatches(getLocalBatches());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();

    if (supabase && !isFirebaseConfigured) {
      const channel = supabase
        .channel('batches_db_changes')
        .on(
          'postgres_changes',
          { event: '*', table: 'batches', schema: 'public' },
          () => fetchBatches()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let success = false;
      
      if (isFirebaseConfigured) {
        await saveFirebaseBatch({
          name: newBatch.name,
          breed: newBatch.breed,
          initial_quantity: newBatch.initial_quantity,
          current_quantity: newBatch.initial_quantity,
          initial_feed_qty: newBatch.initial_feed_qty,
          stocking_date: newBatch.stocking_date,
          status: 'active'
        });
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('batches')
          .insert({
            name: newBatch.name,
            breed: newBatch.breed,
            initial_quantity: newBatch.initial_quantity,
            current_quantity: newBatch.initial_quantity,
            initial_feed_qty: newBatch.initial_feed_qty,
            stocking_date: newBatch.stocking_date,
            status: 'active'
          });

        if (!error) {
          success = true;
        } else {
          console.warn('Supabase batch insert failed, saving to local fallback:', error.message);
        }
      }

      if (!success) {
        saveLocalBatch({
          name: newBatch.name,
          breed: newBatch.breed,
          initial_quantity: newBatch.initial_quantity,
          current_quantity: newBatch.initial_quantity,
          initial_feed_qty: newBatch.initial_feed_qty,
          stocking_date: newBatch.stocking_date,
          status: 'active'
        });
      }
      
      setIsModalOpen(false);
      setNewBatch({
        name: '',
        breed: 'broilers',
        initial_quantity: 0,
        initial_feed_qty: 0,
        stocking_date: format(new Date(), 'yyyy-MM-dd')
      });
      fetchBatches();
    } catch (err: any) {
      alert(err.message || 'Error creating batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveBatch = async () => {
    if (!selectedBatch) return;

    try {
      setIsSubmitting(true);
      let success = false;

      if (isFirebaseConfigured) {
        await updateFirebaseBatchStatus(selectedBatch.id, 'archived');
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('batches')
          .update({ status: 'archived' })
          .eq('id', selectedBatch.id);

        if (!error) {
          success = true;
        } else {
          console.warn('Supabase archive failed, performing locally:', error.message);
        }
      }

      if (!success) {
        updateLocalBatchStatus(selectedBatch.id, 'archived');
      }
      
      setIsArchiveModalOpen(false);
      setSelectedBatch(null);
      fetchBatches();
    } catch (err: any) {
      alert(err.message || 'Error archiving batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-ink-900 tracking-tighter">Bird Batches</h1>
          <p className="text-slate-500 text-sm font-medium mt-3">Advanced lifecycle management and real-time stocking control.</p>
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
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-ink-900 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-black/10 active:scale-95 text-xs uppercase tracking-widest"
          >
            <Plus className="w-5 h-5 text-primary-400" />
            Stock New Batch
          </button>
        )}
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Stock New Batch</h2>
              <p className="text-sm text-slate-500 mb-8">Enter the details of the incoming stock.</p>

              <form onSubmit={handleCreateBatch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Batch Identifier</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Batch #102 - Akobo"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Breed</label>
                    <select 
                      value={newBatch.breed}
                      onChange={(e) => setNewBatch({...newBatch, breed: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    >
                      <option value="broilers">Broilers</option>
                      <option value="layers">Layers</option>
                      <option value="turkey">Turkey</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Initial Qty</label>
                    <input 
                      required
                      type="number" 
                      value={newBatch.initial_quantity}
                      onChange={(e) => setNewBatch({...newBatch, initial_quantity: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Initial Feed (Kg)</label>
                    <input 
                      required
                      type="number" 
                      value={newBatch.initial_feed_qty}
                      onChange={(e) => setNewBatch({...newBatch, initial_feed_qty: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Stocking Date</label>
                    <input 
                      required
                      type="date" 
                      value={newBatch.stocking_date}
                      onChange={(e) => setNewBatch({...newBatch, stocking_date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#064e3b] text-white font-bold py-5 rounded-2xl hover:bg-[#053c2e] transition-all shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Recording...' : 'Stock Batch Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isArchiveModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Archive Batch?</h2>
              <p className="text-sm text-slate-500 mb-8">
                Are you sure you want to archive <span className="font-bold text-slate-900">{selectedBatch?.name}</span>? 
                This will mark the batch as completed and it will no longer appear in daily reporting lists.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleArchiveBatch}
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl hover:bg-amber-700 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Archiving...' : 'Yes, Archive Batch'}
                </button>
                <button 
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name or breed..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 border border-slate-200 bg-white text-slate-600 rounded-2xl hover:border-[#064e3b] hover:text-[#064e3b] transition-all font-bold">
          <Filter className="w-5 h-5" />
          <span>Status</span>
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#064e3b] text-white rounded-2xl hover:bg-[#053c2e] transition-all font-bold shadow-xl shadow-emerald-950/10 active:scale-95 duration-200"
        >
          <Plus className="w-5 h-5 text-primary-400" />
          <span>Add New Batch</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={batch.id}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    batch.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {batch.status}
                  </span>
                  <h3 className="text-xl font-display font-bold text-slate-900 mt-2">{batch.name}</h3>
                </div>
                {isAdmin && batch.status === 'active' && (
                  <button 
                    onClick={() => {
                      setSelectedBatch(batch);
                      setIsArchiveModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all"
                    title="Archive Batch"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Breed Type</span>
                  <span className="text-ink-900 font-bold">{batch.breed}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Stocking Date</span>
                  <span className="text-ink-900 font-bold font-mono">{format(new Date(batch.stocking_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initial Population</span>
                  <span className="text-ink-900 font-bold font-mono">{batch.initial_quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initial Feed</span>
                  <span className="text-ink-900 font-bold font-mono">{batch.initial_feed_qty?.toLocaleString()} KG</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Current Census</p>
                  <p className="text-3xl font-display font-black text-primary-950 font-mono tracking-tighter">{batch.current_quantity.toLocaleString()}</p>
                </div>
                <button className="w-12 h-12 bg-primary-950 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary-950/20 group-hover:bg-primary-400 group-hover:text-primary-950 duration-500">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-emerald-600" />
           </div>
           <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No batches found</h3>
           <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">Start recording your poultry distribution by stocking your first batch of birds.</p>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="inline-flex items-center gap-2 bg-[#064e3b] text-white font-bold px-8 py-5 rounded-2xl hover:bg-[#053c2e] transition-all shadow-xl shadow-emerald-900/10 active:scale-95 mb-4"
           >
             <Plus className="w-5 h-5 text-primary-400" />
             Stock First Batch
           </button>
           {!isSupabaseConfigured && (
             <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-2xl text-xs font-medium border border-yellow-100 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Supabase not connected. Using local simulation.
             </div>
           )}
        </div>
      )}
    </div>
  );
};
