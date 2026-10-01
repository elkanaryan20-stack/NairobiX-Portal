'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { verifyCode } from '@/lib/auth/actions';

export function VerifyCodeForm({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <form action={verifyCode} onSubmit={() => setPending(true)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="code" className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
          Sign-in code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          autoFocus
          maxLength={10}
          placeholder="123456"
          aria-invalid={!!error}
          aria-describedby={error ? 'code-error' : undefined}
          className="block w-full rounded-sm border border-white/10 bg-ink-950/60 px-4 py-3 text-center font-mono text-lg tracking-[0.4em] text-white placeholder:text-neutral-600 transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && (
          <p id="code-error" role="alert" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 ease-smooth hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
