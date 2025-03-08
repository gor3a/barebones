import {useEffect, useState} from 'react';
import {Session} from '@supabase/supabase-js';
import {supabase} from "@/services/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session);
        setInitializing(false);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return {user, initializing};
};
