import { useQuery } from '@tanstack/react-query';

import { supabase } from '../supabase';
import { useSession } from './useSession';

export const profileKey = ['profile'] as const;

export function useProfile() {
  const { session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: [...profileKey, userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, email_verified_at')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
