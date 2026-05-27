import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Users,
  Shield,
  Trash2,
  Mail,
  User,
  X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isFirebaseConfigured } from '../../lib/firebase';
import { getFirebaseProfiles, saveFirebaseProfile, deleteFirebaseProfile } from '../../lib/firebaseService';
import { AdminProfile } from '../../types/admin';
import { format } from 'date-fns';
import { useAuth } from '../../components/admin/AuthGuard';
import { getLocalProfiles, saveLocalProfile, deleteLocalProfile } from '../../lib/dbFallback';

export const StaffDirectory: React.FC = () => {
  const { isAdmin } = useAuth();
  const [staff, setStaff] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    role: 'staff' as const
  });

  const fetchStaff = async () => {
    try {
      if (isFirebaseConfigured) {
        const firestoreProfiles = await getFirebaseProfiles();
        if (firestoreProfiles) {
          setStaff(firestoreProfiles);
          return;
        }
      } else if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('role', { ascending: true });

        if (!error && data) {
          setStaff(data);
          return;
        }
        if (error) console.warn('Supabase staff fetch error, using local fallback:', error.message);
      }
      setStaff(getLocalProfiles());
    } catch (err) {
      console.error('Error fetching staff, using fallback:', err);
      setStaff(getLocalProfiles());
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (person: AdminProfile) => {
    if (!isAdmin) return;
    const newRole = person.role === 'admin' ? 'staff' : 'admin';
    
    try {
      let success = false;
      if (isFirebaseConfigured) {
        await saveFirebaseProfile({
          ...person,
          role: newRole
        });
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', person.id);
        
        if (!error) {
          success = true;
        } else {
          console.warn('Supabase role update failed, updating locally:', error.message);
        }
      }

      if (!success) {
        saveLocalProfile({
          ...person,
          role: newRole
        });
      }
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Error updating role');
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      
      let existingProfile = null;
      if (isFirebaseConfigured) {
        const list = await getFirebaseProfiles();
        existingProfile = list.find(p => p.email.toLowerCase() === newUser.email.toLowerCase());
      } else if (supabase) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', newUser.email.toLowerCase())
            .single();
          existingProfile = data;
        } catch (err) {
          // Ignore
        }
      }

      if (!existingProfile) {
        const localList = getLocalProfiles();
        existingProfile = localList.find(p => p.email.toLowerCase() === newUser.email.toLowerCase());
      }

      if (existingProfile) {
        alert(`${newUser.email} is already in the directory.`);
      } else {
        const profileId = Math.random().toString(36).substring(2, 11);
        const newProfileData: AdminProfile = {
          id: profileId,
          email: newUser.email.toLowerCase(),
          role: newUser.role,
          full_name: newUser.full_name || newUser.email.split('@')[0],
          created_at: new Date().toISOString()
        };

        if (isFirebaseConfigured) {
          await saveFirebaseProfile(newProfileData);
        } else {
          saveLocalProfile(newProfileData);
        }
        alert(`Success! ${newUser.email} has been added to the directory.`);
      }
      setIsModalOpen(false);
      setNewUser({ email: '', full_name: '', role: 'staff' });
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Error adding staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (person: AdminProfile) => {
    if (!isAdmin) return;
    
    let currentEmail = '';
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      currentEmail = session?.user?.email || '';
    } else {
      currentEmail = 'adeagbojohnluj@gmail.com';
    }

    if (person.email === currentEmail) {
      alert("You cannot delete your own profile.");
      return;
    }

    if (!confirm(`Are you sure you want to remove ${person.full_name || person.email}? they will lose all access.`)) return;

    try {
      let success = false;
      if (isFirebaseConfigured) {
        await deleteFirebaseProfile(person.id);
        success = true;
      } else if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', person.id);
        
        if (!error) {
          success = true;
        } else {
          console.warn('Supabase delete staff profile failed, performing locally:', error.message);
        }
      }

      if (!success) {
        deleteLocalProfile(person.id);
      }
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Error deleting staff member');
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10 mb-10">
        <div>
          <h1 className="text-5xl font-display font-black text-ink-900 tracking-tighter">Personnel Hub</h1>
          <p className="text-slate-500 text-sm font-medium mt-3">Access control, role hierarchy, and identity management for YSJ operations.</p>
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
            Add Personnel
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search staff by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
          />
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
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Invite Personnel</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Add staff members by email. Note: They must exist in your Supabase Auth dashboard first.
              </p>
              
              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="e.g., patienceosong6@gmail.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                
                <div className="bg-emerald-50 p-6 rounded-2xl mb-8 space-y-4">
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    <span className="font-bold">Important:</span> Profile records are automatically synchronized upon the user's first login. 
                    If <span className="font-bold">{newUser.email || 'the user'}</span> has already logged in but isn't appearing, ensure their account is active in Supabase.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#064e3b] text-white font-black py-5 rounded-2xl hover:bg-[#053c2e] transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
                >
                  Send Invite / Confirm
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400">Loading directory...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">No staff members found.</div>
        ) : (
          filteredStaff.map((person) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={person.id}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full group-hover:scale-150 transition-transform duration-700 ${
                person.role === 'admin' ? 'bg-yellow-500/5' : 'bg-emerald-500/5'
              }`} />
              
              <div className="flex justify-between items-start mb-8">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${
                  person.role === 'admin' ? 'bg-yellow-50 text-yellow-600' : 'bg-primary-50 text-primary-600'
                }`}>
                  <User className="w-7 h-7" />
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                  person.role === 'admin' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-primary-50 text-primary-600 border-primary-200'
                }`}>
                  {person.role}
                </span>
              </div>

              <h3 className="text-2xl font-display font-black text-ink-900 mb-2 leading-none tracking-tight">{person.full_name || 'Anonymous User'}</h3>
              <div className="flex items-center gap-2.5 text-slate-400 text-[11px] mb-10 font-bold uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 opacity-50" />
                <span>{person.email}</span>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Enrolled {format(new Date(person.created_at), 'MMM yyyy')}</p>
                <div className="flex gap-2">
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => handleToggleRole(person)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                        title="Modify Credentials"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      {person.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteStaff(person)}
                          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
