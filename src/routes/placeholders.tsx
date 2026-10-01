import { ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { Screen } from '@/components/ui';

export function LibraryPage() {
  return <Screen title="Library" />;
}

export function SearchPage() {
  return <Screen title="Search" />;
}

export function PracticePage() {
  return <Screen title="Practice" />;
}

export function SongPage() {
  const { id } = useParams();

  return (
    <Screen>
      <Link to="/" className="mb-4 flex items-center gap-1 text-muted">
        <ChevronLeft className="size-5" aria-hidden />
        Library
      </Link>
      <p className="text-muted">Song {id}</p>
    </Screen>
  );
}
