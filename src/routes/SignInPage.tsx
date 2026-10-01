import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Screen, TextField } from '@/components/ui';
import { useSignIn } from '@/lib/queries';
import { signInFormSchema, type SignInForm } from '@/lib/schemas/auth';

export function SignInPage() {
  const signIn = useSignIn();
  const { register, handleSubmit, formState } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) => signIn.mutate(values));

  return (
    <Screen>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-16">
        <div className="mb-10 flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-text">
            MAL<span className="text-accent">guitar</span>
          </h1>
          <p className="text-base text-muted">Track every song you learn.</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            error={formState.errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            error={formState.errors.password?.message}
            {...register('password')}
          />
          {signIn.error ? <p className="text-sm text-danger">{signIn.error.message}</p> : null}
          <Button type="submit" label="Sign in" loading={signIn.isPending} />
        </form>
      </div>
    </Screen>
  );
}
