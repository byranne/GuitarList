import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

import { Button, Screen, TextField } from '@/components/ui';
import { useConfirmVerificationCode, useSendVerificationCode, useSession } from '@/lib/queries';
import { otpFormSchema, type OtpForm } from '@/lib/schemas/auth';

const RESEND_COOLDOWN_S = 30;

export default function VerifyEmailScreen() {
  const { session } = useSession();
  const email = session?.user.email ?? '';
  const sendCode = useSendVerificationCode();

  return (
    <Screen title="Verify your email">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {sendCode.isSuccess ? (
          <CodeStep email={email} />
        ) : (
          <View className="gap-4">
            <Text className="text-base text-muted">
              We’ll send a 6-digit code to <Text className="font-semibold text-text">{email}</Text>.
            </Text>
            {sendCode.error ? (
              <Text className="text-sm text-danger">{sendCode.error.message}</Text>
            ) : null}
            <Button
              label="Send code"
              onPress={() => sendCode.mutate(email)}
              loading={sendCode.isPending}
            />
          </View>
        )}
        {/* Web has no swipe-to-dismiss for modals, so always offer a way out. */}
        <View className="mt-4">
          <Button label="Not now" variant="ghost" onPress={() => router.back()} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function CodeStep({ email }: { email: string }) {
  const confirmCode = useConfirmVerificationCode();
  const resendCode = useSendVerificationCode();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const { control, handleSubmit, formState } = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { token: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = handleSubmit(({ token }) =>
    confirmCode.mutate({ email, token }, { onSuccess: () => router.back() }),
  );

  const resend = () => {
    resendCode.mutate(email, { onSuccess: () => setCooldown(RESEND_COOLDOWN_S) });
  };

  const error = confirmCode.error ?? resendCode.error;

  return (
    <View className="gap-4">
      <Text className="text-base text-muted">
        Enter the code we sent to <Text className="font-semibold text-text">{email}</Text>
      </Text>
      <Controller
        control={control}
        name="token"
        render={({ field }) => (
          <TextField
            placeholder="123456"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            returnKeyType="done"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={submit}
            error={formState.errors.token?.message}
          />
        )}
      />
      {error ? <Text className="text-sm text-danger">{error.message}</Text> : null}
      <Button label="Verify" onPress={submit} loading={confirmCode.isPending} />
      <Pressable
        accessibilityRole="button"
        onPress={resend}
        disabled={cooldown > 0 || resendCode.isPending}
        hitSlop={8}
        className="self-end"
      >
        <Text className={cooldown > 0 ? 'text-sm text-muted' : 'text-sm font-semibold text-accent'}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </Text>
      </Pressable>
    </View>
  );
}
