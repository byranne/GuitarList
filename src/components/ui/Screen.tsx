import type { ReactNode } from 'react';

type ScreenProps = {
  title?: string;
  children?: ReactNode;
};

// Page wrapper: safe-area top padding (the PWA draws under the iOS status bar).
export function Screen({ title, children }: ScreenProps) {
  return (
    <div className="flex min-h-full flex-col px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
      {title ? <h1 className="mb-4 text-3xl font-bold text-text">{title}</h1> : null}
      {children}
    </div>
  );
}
