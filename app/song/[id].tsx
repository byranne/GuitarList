import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/ui';

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen testID="song-detail">
      <Text className="text-muted">Song {id}</Text>
    </Screen>
  );
}
