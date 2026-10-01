import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button, Screen } from '@/components/ui';
import { useProfile, useSession, useSignOut } from '@/lib/queries';

export default function ProfileScreen() {
  const { session } = useSession();
  const profile = useProfile();
  const signOut = useSignOut();
  const verified = !!profile.data?.email_verified_at;

  return (
    <Screen title="Profile">
      <View className="gap-6">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-base text-muted">
            Signed in as <Text className="text-text">{session?.user.email}</Text>
          </Text>
          {verified ? (
            <View className="rounded-full border border-border px-2 py-0.5">
              <Text className="text-xs font-semibold text-accent">Verified</Text>
            </View>
          ) : null}
        </View>

        {profile.data && !verified ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/verify-email')}
            className="gap-1 rounded-xl border border-border bg-surface p-4"
          >
            <Text className="text-base font-semibold text-text">Verify your email</Text>
            <Text className="text-sm text-muted">
              Confirm it’s you with a quick code, so you can recover your account later.
            </Text>
          </Pressable>
        ) : null}

        {signOut.error ? (
          <Text className="text-sm text-danger">{signOut.error.message}</Text>
        ) : null}
        <Button
          label="Sign out"
          variant="ghost"
          onPress={() => signOut.mutate()}
          loading={signOut.isPending}
        />
      </View>
    </Screen>
  );
}
