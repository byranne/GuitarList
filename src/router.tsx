import { createBrowserRouter, Navigate } from 'react-router';

import { GuestOnly, RequireSession } from './routes/guards';
import { LibraryPage, PracticePage, SearchPage, SongPage } from './routes/placeholders';
import { SignInPage } from './routes/SignInPage';
import { StatsPage } from './routes/StatsPage';
import { TabsLayout } from './routes/TabsLayout';

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [{ path: '/sign-in', element: <SignInPage /> }],
  },
  {
    element: <RequireSession />,
    children: [
      {
        element: <TabsLayout />,
        children: [
          { index: true, element: <LibraryPage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'stats', element: <StatsPage /> },
        ],
      },
      { path: 'song/:id', element: <SongPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
