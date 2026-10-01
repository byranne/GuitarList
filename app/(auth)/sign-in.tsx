import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, Text, View, type TextInput } from 'react-native';

import { Button, Screen, TextField } from '@/components/ui';
import { useSignIn, useSignUp } from '@/lib/queries';
import {
  signInFormSchema,
  signUpFormSchema,
  type SignInForm,
  type SignUpForm,
} from '@/lib/schemas/auth';

type Mode = 'sign-in' | 'sign-up';

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('sign-in');

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center"
      >
        <View className="mb-10 items-center gap-2">
          <Text className="text-4xl font-extrabold text-text">
            MAL<Text className="text-accent">guitar</Text>
          </Text>
          <Text className="text-base text-muted">Track every song you learn.</Text>
        </View>

        {/* Keyed so each form mounts fresh with its own validation state. */}
        {mode === 'sign-in' ? <SignInStep key="in" /> : <SignUpStep key="up" />}

        <View className="mt-6 flex-row justify-center gap-1">
          <Text className="text-sm text-muted">
            {mode === 'sign-in' ? 'New to MALguitar?' : 'Already have an account?'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
            hitSlop={8}
          >
            <Text className="text-sm font-semibold text-accent">
              {mode === 'sign-in' ? 'Create an account' : 'Sign in'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function SignInStep() {
  const signIn = useSignIn();
  const passwordRef = useRef<TextInput>(null);
  const { control, handleSubmit, formState } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) => signIn.mutate(values));

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            ref={passwordRef}
            label="Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={submit}
            error={formState.errors.password?.message}
          />
        )}
      />
      {signIn.error ? <Text className="text-sm text-danger">{signIn.error.message}</Text> : null}
      <Button label="Sign in" onPress={submit} loading={signIn.isPending} />
    </View>
  );
}

function SignUpStep() {
  const signUp = useSignUp();
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const { control, handleSubmit, formState } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const submit = handleSubmit(({ email, password }) => signUp.mutate({ email, password }));

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            ref={passwordRef}
            label="Password"
            placeholder="At least 8 characters, with a number"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={() => confirmRef.current?.focus()}
            error={formState.errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <TextField
            ref={confirmRef}
            label="Confirm password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            onSubmitEditing={submit}
            error={formState.errors.confirmPassword?.message}
          />
        )}
      />
      {signUp.error ? <Text className="text-sm text-danger">{signUp.error.message}</Text> : null}
      <Button label="Create account" onPress={submit} loading={signUp.isPending} />
    </View>
  );
}
