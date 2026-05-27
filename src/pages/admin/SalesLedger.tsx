import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isFirebaseConfigured } from '../../lib/firebase';
import { getFirebaseSales, saveFirebaseSale } from '../../lib/firebaseService';
import { SalesEntry } from '../../types/admin';
import { format } from 'date-fns';
import { useAuth } from '../../components/admin/AuthGuard';
import { getLocalSales, saveLocalSale } from '../../lib/dbFallback';

export const SalesLedger: React.FC = () => {
  const { isAdmin } = useAuth();
  const [sales, setSales] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSale, setNewSale] = useState({
    item_name: '',
    category: 'birds' as const,
    quantity: 0,
    unit_price: 0,
    customer_name: '',
    sale_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchData = async () => {
    try {
      if (isFirebaseConfigured) {
        const firestoreSales = await getFirebaseSales();
        if (firestoreSales) {
          setSales(firestoreSales);
          return;
        }
      } else if (supabase) {
        const { data, error } = await supabase
          .from('sales_ledger')
          .select('*')
          .order('sale_date', { ascending: false });

        if (!error && data) {
          setSales(data);
          return;
        }
        if (error) console.warn('Supabase sales fetch error, using local fallback:', error.message);
      }
      setSales(getLocalSales());
    } catch (err) {
      console.error('Error fetching sales, using fallback:', err);
      setSales(getLocalSales());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const total_amount = newSale.quantity * newSale.unit_price;
      
      let success = false;
      if (isFirebaseConfigured) {
        await saveFirebaseSale({
          ...newSale,
          total_amount
        });
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('sales_ledger')
          .insert({
            ...newSale,
            total_amount
          });

        if (!error) {
          success = true;
        } else {
          console.warn('Supabase sales insert failed, using fallback:', error.message);
        }
      }

      if (!success) {
        saveLocalSale({
          ...newSale,
          total_amount
        });
      }
      
      setIsModalOpen(false);
      setNewSale({
        item_name: '',
        category: 'birds',
        quantity: 0,
        unit_price: 0,
        customer_name: '',
        sale_date: format(new Date(), 'yyyy-MM-dd')
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error recording sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = sales.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-ink-900 tracking-tighter">Sales Ledger</h1>
          <p className="text-slate-500 text-sm font-medium mt-3">Comprehensive tracking of poultry revenue and institutional byproduct sales.</p>
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
            Record New Sale
          </button>
        )}
      </div>

      {/* Summary Mini-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Gross Cumulative Revenue</p>
           <h3 className="text-4xl font-display font-black text-ink-900 leading-none tracking-tighter">
             <span className="font-mono">₦{totalRevenue.toLocaleString()}</span>
           </h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Total Assets Disbursed</p>
           <h3 className="text-4xl font-display font-black text-primary-950 leading-none tracking-tighter">
             <span className="font-mono text-emerald-600">
               {sales.filter(s => s.category === 'birds').reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()}
             </span>
           </h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Order Volume</p>
           <h3 className="text-4xl font-display font-black text-ink-900 leading-none tracking-tighter">
             <span className="font-mono text-blue-600">{sales.length}</span>
           </h3>
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Record Sale</h2>
              <p className="text-sm text-slate-500 mb-8">Generate a new transaction record.</p>

              <form onSubmit={handleCreateSale} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Item Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Live Broilers (Batch #80)"
                    value={newSale.item_name}
                    onChange={(e) => setNewSale({...newSale, item_name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select 
                      value={newSale.category}
                      onChange={(e) => setNewSale({...newSale, category: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="birds">Live Birds</option>
                      <option value="frozen">Agriculture (Maize/Cashew)</option>
                      <option value="other">Other (Feed/Manure)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Quantity</label>
                    <input 
                      required
                      type="number" 
                      value={newSale.quantity || ''}
                      onChange={(e) => setNewSale({...newSale, quantity: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Unit Price (₦)</label>
                    <input 
                      required
                      type="number" 
                      value={newSale.unit_price || ''}
                      onChange={(e) => setNewSale({...newSale, unit_price: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Sale Date</label>
                    <input 
                      required
                      type="date" 
                      value={newSale.sale_date}
                      onChange={(e) => setNewSale({...newSale, sale_date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Est. Total Amount</span>
                    <span className="text-xl font-black text-emerald-900">₦{(newSale.quantity * newSale.unit_price).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#064e3b] text-white font-bold py-5 rounded-2xl hover:bg-[#053c2e] transition-all shadow-xl shadow-emerald-900/10 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Transaction...' : 'Confirm Sale Record'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm mt-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fafafa]">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Date</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settlement Info</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Class</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Accessing financial records...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No ledger entries found</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8 text-sm font-bold text-ink-900 font-mono italic">{format(new Date(sale.sale_date), 'MMM dd, yyyy')}</td>
                    <td className="px-10 py-8">
                      <div>
                        <p className="text-sm font-black text-ink-900 leading-none">{sale.item_name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Inventory Count: <span className="text-primary-950 font-mono">{sale.quantity}</span></p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest text-[#0d3a2b]">
                        {sale.category === 'frozen' ? 'Maize / Cashew' : sale.category === 'birds' ? 'Live Birds' : 'Other Assets'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-ink-900 text-base font-mono tracking-tighter">
                      ₦{Number(sale.total_amount).toLocaleString()}
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
