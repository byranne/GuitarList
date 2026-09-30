import { Navigate, Outlet } from 'react-router';

import { useSession } from '@/lib/queries';

// Blank background while the stored session is read, so signed-in users don't
// see the sign-in page flash on launch.
function Splash() {
  return <div className="min-h-dvh bg-background" />;
}

export function RequireSession() {
  const { session, isLoading } = useSession();
  if (isLoading) return <Splash />;
  if (!session) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export function GuestOnly() {
  const { session, isLoading } = useSession();
  if (isLoading) return <Splash />;
  if (session) return <Navigate to="/" replace />;
  return <Outlet />;
}
