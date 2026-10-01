import { useMutation } from '@tanstack/react-query';

import { supabase } from '../supabase';

// Invite-only: accounts (with a password) are created in the Supabase
// dashboard and sign-ups are disabled, so the app never creates users.
// On success the auth listener sets the session and the router leaves /sign-in.
export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });
}
