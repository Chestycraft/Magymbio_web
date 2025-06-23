'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase-client';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // loading state for role

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from('roles')
          .select('role')
          .eq('email', session.user.email)
          .maybeSingle();

        if (!error && data) {
          setRole(data.role);
        }
      }

      setLoading(false);
    };

    getSessionAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Recheck role on login/logout
      if (session?.user) {
        supabase
          .from('roles')
          .select('role')
          .eq('email', session.user.email)
          .maybeSingle()
          .then(({ data }) => {
            setRole(data?.role ?? null);
                setLoading(false); // ✅ important
          });
      } else {
        setRole(null);
          setLoading(false); // ✅ important
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, role, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseSession = () => useContext(SupabaseContext);
