import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, Mail, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ChickenLogo } from '../../components/ChickenLogo';
import { Preloader } from '../../components/Preloader';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // If already logged in to Firebase or Supabase, skip login page
    if (isFirebaseConfigured && auth?.currentUser) {
      navigate('/admin');
    } else if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate('/admin');
      });
    }
  }, [navigate]);

  const handleFirebaseGoogleLogin = async () => {
    if (!auth) return;
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      // Force account selection for better user experience
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      console.error("Firebase login error:", err);
      setError(err.message || 'Error executing Google Sign-In with Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFirebaseConfigured && auth) {
      try {
        setLoading(true);
        setError(null);
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/admin');
      } catch (err: any) {
        console.error("Firebase email sign-in error:", err);
        setError(err.message || 'Invalid credentials or login error with Firebase.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Fall back to Supabase route
    if (!isSupabaseConfigured || (supabase && (supabase as any).supabaseUrl.includes('your_supabase_url'))) {
      setError('Please use the sign-in options configured for your project.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-6 font-sans">
      <Preloader />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
              <ChickenLogo headColorClass="text-[#064e3b]" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">YSJ Suite Login</h1>
            <p className="text-emerald-200/60 text-[9px] tracking-widest uppercase font-black">Authorized Personnel Only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col text-left space-y-3"
            >
              <div className="flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-200 text-xs leading-relaxed">{error}</p>
              </div>
              
              {(error.toLowerCase().includes('configuration-not-found') || error.toLowerCase().includes('auth/configuration-not-found')) && (
                <div className="pt-2 border-t border-red-500/15 text-xs text-red-100 flex flex-col space-y-2">
                  <p className="font-semibold text-yellow-400">💡 Firebase Action Required:</p>
                  <p className="opacity-80 text-[11px] leading-normal">
                    The Email / Password Sign-In provider has not been turned on yet in your Firebase Console.
                  </p>
                  <div className="bg-black/30 p-2.5 rounded-lg text-[10px] space-y-1 font-mono text-emerald-300">
                    <p className="font-bold text-white">To Enable This:</p>
                    <p>1. Open standard Firebase Console for your project ("ysj-farm-limited")</p>
                    <p>2. Go to: Authentication &gt; Sign-in method</p>
                    <p>3. Add "Email/Password" provider and switch it to enabled</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('ysj_sandbox_mode', 'true');
                      localStorage.setItem('ysj_sandbox_session', JSON.stringify({
                        uid: 'sandbox-dev',
                        email: 'adeagbojohnluj@gmail.com',
                        name: 'Sandbox Developer'
                      }));
                      window.location.reload();
                    }}
                    className="w-full bg-[#fbbf24] hover:bg-yellow-500 text-[#064e3b] font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all mt-1"
                  >
                    ⚡ Bypass: Enable Offline Sandbox
                  </button>
                </div>
              )}

              {(error.toLowerCase().includes('network-request-failed') || error.toLowerCase().includes('network_error') || error.toLowerCase().includes('network-error') || error.toLowerCase().includes('failed-to-fetch')) && (
                <div className="pt-2 border-t border-red-500/10 text-xs text-red-100 flex flex-col space-y-2">
                  <p className="font-semibold text-yellow-400">🚨 Iframe Network Block Detected:</p>
                  <p className="opacity-80 text-[11px] leading-normal">
                    This error usually happens because modern browser security shields (or AdBlockers) block cross-origin authentication requests inside iframes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('ysj_sandbox_mode', 'true');
                      localStorage.setItem('ysj_sandbox_session', JSON.stringify({
                        uid: 'sandbox-dev',
                        email: 'adeagbojohnluj@gmail.com',
                        name: 'Sandbox Developer'
                      }));
                      window.location.reload();
                    }}
                    className="w-full bg-[#fbbf24] hover:bg-yellow-500 text-[#064e3b] font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all"
                  >
                    ⚡ Enable Offline Sandbox (LocalStorage) Fallback
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {isFirebaseConfigured ? (
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleFirebaseGoogleLogin}
                disabled={loading}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#064e3b] font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-[#064e3b]/30 border-t-[#064e3b] rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.5 1.62l2.437-2.437C17.48.97 15.01 0 12.24 0c-6.08 0-11 4.92-11 11s4.92 11 11 11c5.805 0 10.686-4.11 11-10H12.24z" />
                    </svg>
                    <span>Sign In with Google</span>
                  </>
                )}
              </button>
              
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative z-10 bg-[#064e3b] px-4 text-[10px] text-emerald-200/40 uppercase tracking-widest font-black">Or use Supabase fallback</span>
              </div>
            </div>
          ) : null}

          {/* Fallback Email/Password Forms (for Supabase or manual dev bypass) */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-300/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full bg-white/10 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:bg-white/20 focus:border-yellow-500 outline-none transition-all placeholder:text-emerald-200/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-300/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:bg-white/20 focus:border-yellow-500 outline-none transition-all placeholder:text-emerald-200/20"
                />
              </div>
            </div>

            <button
              disabled={loading || (isFirebaseConfigured ? false : !isSupabaseConfigured)}
              className="w-full bg-emerald-700/50 hover:bg-emerald-600 border border-emerald-500/20 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Enter with Credentials</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5">
            <p className="text-emerald-200/40 text-[10px] text-center leading-relaxed font-bold uppercase tracking-wider mb-4 font-mono">
              Note: Only admin can add staff. <br />There is no public sign up page.
            </p>
            
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('ysj_sandbox_mode', 'true');
                  localStorage.setItem('ysj_sandbox_session', JSON.stringify({
                    uid: 'sandbox-dev',
                    email: 'adeagbojohnluj@gmail.com',
                    name: 'Sandbox Developer'
                  }));
                  window.location.reload();
                }}
                className="w-full text-[10px] font-black text-yellow-400 hover:text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl border border-white/5 hover:border-white/20 transition-all"
              >
                🛠️ Run in Offline Sandbox Mode (Full Feature Access)
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#fbbf24] hover:text-white transition-all text-xs font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl border border-white/5 hover:border-white/20"
              >
                ← Back to Farm Homepage
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
