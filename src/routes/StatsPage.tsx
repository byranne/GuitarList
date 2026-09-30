import { Button, Screen } from '@/components/ui';
import { useSession, useSignOut } from '@/lib/queries';

export function StatsPage() {
  const { session } = useSession();
  const signOut = useSignOut();

  return (
    <Screen title="Stats">
      <div className="mt-auto flex flex-col gap-3 pb-6">
        <p className="text-sm text-muted">
          Signed in as <span className="text-text">{session?.user.email}</span>
        </p>
        {signOut.error ? <p className="text-sm text-danger">{signOut.error.message}</p> : null}
        <Button
          label="Sign out"
          variant="ghost"
          onClick={() => signOut.mutate()}
          loading={signOut.isPending}
        />
      </div>
    </Screen>
  );
}
