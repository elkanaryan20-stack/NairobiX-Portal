'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth/actions';

export function SignInForm({ next, error }: { next: string; error?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <form action={signIn} onSubmit={() => setPending(true)} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="you@company.com"
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          className="block w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-fg placeholder:text-fg-tertiary transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying access…
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
