import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../supabase';
import { profileKey } from './useProfile';

type Credentials = { email: string; password: string };

// On success the auth listener updates the session and Stack.Protected routes to the tabs.
export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
  });
}

// Emails a 6-digit code to an existing account (the magic_link template renders the code).
export function useSendVerificationCode() {
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

// Verifying the code swaps in a session whose JWT proves inbox access, which
// mark_email_verified() checks before recording it on the profile.
export function useConfirmVerificationCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      const { data, error: rpcError } = await supabase.rpc('mark_email_verified');
      if (rpcError) throw rpcError;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKey }),
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
