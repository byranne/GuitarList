import { forwardRef, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme';

type TextFieldProps = Omit<TextInputProps, 'placeholderTextColor' | 'className'> & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-2">
      {label ? <Text className="text-sm font-medium text-muted">{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={[
          'h-12 rounded-xl border bg-surface px-4 text-base text-text',
          error ? 'border-danger' : focused ? 'border-accent' : 'border-border',
        ].join(' ')}
        {...inputProps}
      />
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
});
