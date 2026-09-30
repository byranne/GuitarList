import { useMutation } from '@tanstack/react-query';

import { supabase } from '../supabase';

// Invite-only: accounts are created in the Supabase dashboard, so the app never
// creates users. The magic_link email template renders a 6-digit code.
export function useSendCode() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
    },
  });
}

// On success the auth listener sets the session and the router leaves /sign-in.
export function useVerifyCode() {
  return useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
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
