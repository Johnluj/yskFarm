import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseProfile, saveFirebaseProfile } from '../../lib/firebaseService';
import { AdminProfile } from '../../types/admin';

interface AuthContextType {
  session: any;
  profile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const location = useLocation();

  // Clean, consolidated check for email authority
  const getRoleForEmail = (email: string): 'admin' | 'staff' => {
    const cleanEmail = email.toLowerCase();
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'Admin@ysjfarm.com').toLowerCase();
    const developerEmail = 'adeagbojohnluj@gmail.com';
    return (cleanEmail === adminEmail || cleanEmail === developerEmail) ? 'admin' : 'staff';
  };

  useEffect(() => {
    // 0. --- SANDBOX OFFLINE MODE BYPASS ---
    const isSandboxBypass = typeof window !== 'undefined' && localStorage.getItem('ysj_sandbox_mode') === 'true';
    if (isSandboxBypass) {
      const sandboxSessionStr = localStorage.getItem('ysj_sandbox_session');
      if (sandboxSessionStr) {
        try {
          const sessionData = JSON.parse(sandboxSessionStr);
          setSession({ user: { id: sessionData.uid || 'sandbox-dev-id', email: sessionData.email || 'adeagbojohnluj@gmail.com' } });
          setProfile({
            id: sessionData.uid || 'sandbox-dev-id',
            email: sessionData.email || 'adeagbojohnluj@gmail.com',
            role: 'admin',
            full_name: sessionData.name || 'Sandbox Developer',
            created_at: new Date().toISOString()
          });
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse sandbox session:", e);
        }
      }
    }

    // 1. --- FIREBASE DYNAMIC PATH ---
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        try {
          if (fbUser) {
            setSession({ user: { id: fbUser.uid, email: fbUser.email } });
            
            // Look up or establish user profile in Firestore
            let currentProfile = await getFirebaseProfile(fbUser.uid);
            
            if (!currentProfile) {
              const assignedRole = getRoleForEmail(fbUser.email || '');
              currentProfile = {
                id: fbUser.uid,
                email: (fbUser.email || '').toLowerCase(),
                role: assignedRole,
                full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Staff Member',
                created_at: new Date().toISOString()
              };
              
              await saveFirebaseProfile(currentProfile);
            } else {
              // Auto-upgrade role in Firestore database if email is a designated administrator
              const correctRole = getRoleForEmail(fbUser.email || '');
              if (correctRole === 'admin' && currentProfile.role !== 'admin') {
                currentProfile.role = 'admin';
                await saveFirebaseProfile(currentProfile);
              }
            }
            
            setProfile(currentProfile);
          } else {
            setSession(null);
            setProfile(null);
          }
        } catch (err) {
          console.error("Firebase auth bootstrapping error:", err);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }

    // 2. --- SUPABASE DYNAMIC PATH (FALLBACK) ---
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session?.user) {
          await bootstrapSupabaseProfile(session.user);
        }
      } catch (err) {
        console.error('Supabase auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Safety timeout to prevent infinite rotation
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const bootstrapSupabaseProfile = async (user: any) => {
      try {
        const { data: existingProfile, error: fetchError } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const isUserOverallAdmin = getRoleForEmail(user.email) === 'admin';

        if (fetchError && fetchError.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase!
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email.toLowerCase(),
              role: isUserOverallAdmin ? 'admin' : 'staff',
              full_name: user.user_metadata?.full_name || user.email.split('@')[0]
            })
            .select()
            .single();

          if (!insertError) setProfile(newProfile);
        } else if (existingProfile) {
          if (isUserOverallAdmin && existingProfile.role !== 'admin') {
            const { data: updatedProfile } = await supabase!
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', user.id)
              .select()
              .single();
            setProfile(updatedProfile || existingProfile);
          } else {
            setProfile(existingProfile);
          }
        }
      } catch (err) {
        console.error('Error bootstrapping profile:', err);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await bootstrapSupabaseProfile(session.user);
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Allow bypassing auth screen for sandbox preview testing if wanted, 
  // but standard state requires session
  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'Admin@ysjfarm.com').toLowerCase();
  const developerEmail = 'adeagbojohnluj@gmail.com';
  const isOverallAdmin = (profile?.role === 'admin') || 
                         (session?.user?.email?.toLowerCase() === adminEmail) || 
                         (session?.user?.email?.toLowerCase() === developerEmail);

  return (
    <AuthContext.Provider value={{ session, profile, loading, isAdmin: isOverallAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

