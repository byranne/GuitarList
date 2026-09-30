import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Screen, TextField } from '@/components/ui';
import { useSendCode, useVerifyCode } from '@/lib/queries';
import { emailFormSchema, otpFormSchema, type EmailForm, type OtpForm } from '@/lib/schemas/auth';

const RESEND_COOLDOWN_S = 30;

export function SignInPage() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <Screen>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-16">
        <div className="mb-10 flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-text">
            MAL<span className="text-accent">guitar</span>
          </h1>
          <p className="text-base text-muted">Track every song you learn.</p>
        </div>

        {email ? (
          <CodeStep email={email} onChangeEmail={() => setEmail(null)} />
        ) : (
          <EmailStep onSent={setEmail} />
        )}
      </div>
    </Screen>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const sendCode = useSendCode();
  const { register, handleSubmit, formState } = useForm<EmailForm>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
  });

  const submit = handleSubmit(({ email }) =>
    sendCode.mutate(email, { onSuccess: () => onSent(email) }),
  );

  return (
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
      {sendCode.error ? <p className="text-sm text-danger">{sendCode.error.message}</p> : null}
      <Button type="submit" label="Email me a code" loading={sendCode.isPending} />
    </form>
  );
}

function CodeStep({ email, onChangeEmail }: { email: string; onChangeEmail: () => void }) {
  const verifyCode = useVerifyCode();
  const resendCode = useSendCode();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const { register, handleSubmit, formState } = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { token: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = handleSubmit(({ token }) => verifyCode.mutate({ email, token }));

  const resend = () => {
    resendCode.mutate(email, { onSuccess: () => setCooldown(RESEND_COOLDOWN_S) });
  };

  const error = verifyCode.error ?? resendCode.error;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <p className="text-base text-muted">
        Enter the code we sent to <span className="font-semibold text-text">{email}</span>
      </p>
      <TextField
        placeholder="123456"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        error={formState.errors.token?.message}
        {...register('token')}
      />
      {error ? <p className="text-sm text-danger">{error.message}</p> : null}
      <Button type="submit" label="Sign in" loading={verifyCode.isPending} />
      <div className="flex justify-between">
        <button type="button" onClick={onChangeEmail} className="text-sm text-muted">
          Use a different email
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0 || resendCode.isPending}
          className={cooldown > 0 ? 'text-sm text-muted' : 'text-sm font-semibold text-accent'}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>
    </form>
  );
}
