import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  title?: string;
  children?: ReactNode;
  testID?: string;
};

export function Screen({ title, children, testID }: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background" testID={testID}>
      <View className="flex-1 px-5 pt-4">
        {title ? (
          <Text accessibilityRole="header" className="mb-4 text-3xl font-bold text-text">
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}
