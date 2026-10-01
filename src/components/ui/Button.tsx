import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      className={[
        'h-12 flex-row items-center justify-center rounded-full px-6 active:opacity-80',
        isPrimary ? 'bg-accent' : 'bg-transparent',
        isDisabled ? 'opacity-50' : '',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors['on-accent'] : colors.text} />
      ) : (
        <Text
          className={
            isPrimary ? 'text-base font-semibold text-on-accent' : 'text-base font-medium text-muted'
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
