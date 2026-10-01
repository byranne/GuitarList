import { ChartColumn, Dumbbell, Library, Search, type LucideIcon } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Library', icon: Library },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/stats', label: 'Stats', icon: ChartColumn },
];

export function TabsLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        <ul className="flex h-16">
          {tabs.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'flex h-full flex-col items-center justify-center gap-1 text-xs font-medium',
                    isActive ? 'text-accent' : 'text-muted',
                  ].join(' ')
                }
              >
                <Icon className="size-6" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
