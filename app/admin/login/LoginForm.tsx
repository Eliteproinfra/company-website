"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-dark-black placeholder:text-neutral-400 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

function SubmitButton() {
  // useFormStatus reads the enclosing form's pending state, so it has to live in
  // a child of <form> rather than alongside the action state.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-bold text-dark-black">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-bold text-dark-black">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
