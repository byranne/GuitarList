import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase } from '../supabase';

type SessionState = {
  session: Session | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SessionState>({ session: null, isLoading: true });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setState({ session: data.session, isLoading: false });
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, isLoading: false });
      // Don't leak one account's cached data into the next.
      if (event === 'SIGNED_OUT') queryClient.clear();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [queryClient]);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <AuthProvider>');
  return ctx;
}
