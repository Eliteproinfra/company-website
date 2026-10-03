"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

// Underline fields: the label sits inside the box and lifts on focus/fill, so the
// placeholder has to be a blank space for peer-placeholder-shown to track it.
const inputClass =
  "peer w-full border-b border-neutral-300 bg-transparent pb-2 pt-5 text-dark-black placeholder:text-transparent focus:border-primary-gold focus:outline-none";

const labelClass =
  "pointer-events-none absolute left-0 top-0 text-xs font-semibold uppercase tracking-[0.6px] text-primary-gold transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-neutral-400 peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.6px] peer-focus:text-primary-gold";

function SubmitButton() {
  // useFormStatus reads the enclosing form's pending state, so it has to live in
  // a child of <form> rather than alongside the action state.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gradient-to-r from-primary-gold to-secondary-gold px-6 py-3 text-sm font-bold uppercase tracking-[1.2px] text-ink transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next} />

      <div className="relative">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder=" "
          required
          autoFocus
          className={inputClass}
        />
        <label htmlFor="username" className={labelClass}>
          Username
        </label>
      </div>

      <div className="relative">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder=" "
          required
          className={inputClass}
        />
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="pt-2">
        <SubmitButton />
      </div>

      <p className="text-center text-xs text-neutral-500">
        Lost access? Contact the site administrator.
      </p>
    </form>
  );
}
