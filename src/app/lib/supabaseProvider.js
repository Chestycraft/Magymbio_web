'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase-client';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
 const [session, setSession] = useState(undefined);

 //this useeffect is for getting and setting session once and then it listens to authstate and if unauthenticated already it will stop listening
 useEffect(() => {
    const getSession = async () => {

      const { data: { session } } = await supabase.auth.getSession();//destructures the getsession it returns data which has a session object inside and also an error
      setSession(session);
    };
    
    getSession();
     //onauthchange returns data property, we destrucutre it here and rename it into"listener" using colon then we update the session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
//cleanup
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

 return (
    <SupabaseContext.Provider value={{ session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabaseSession = () => useContext(SupabaseContext);