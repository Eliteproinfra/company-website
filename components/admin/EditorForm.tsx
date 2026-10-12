"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

/** What a save action hands back when it refuses. Success never returns — the
 *  action redirects to the listing instead. */
export type EditorFormState = { error: string | null };

export const EDITOR_FORM_INITIAL: EditorFormState = { error: null };

/**
 * Wraps a long admin editor form so a refused save does NOT navigate.
 *
 * This exists because of real data loss, not tidiness. savePropertyAction used
 * to `redirect()` back to the editor with `?error=…` when it would not accept a
 * submission. A redirect re-renders the page from the server, and everything in
 * the editor that lives in React state — the gallery, every repeater row, the
 * amenity picks — is built client-side from `defaultValue`, which for a new
 * listing is empty. So one refusal silently threw away every photo the author
 * had uploaded and everything they had typed, with the explanation pinned to
 * the top of a form thousands of pixels tall. From down at the Gallery it just
 * looked like the images had never uploaded.
 *
 * useActionState keeps the refusal on the client, so nothing unmounts and the
 * work survives. The success path still redirects, which is what it should do.
 *
 * `children` is server-rendered and passed straight through: the fields stay in
 * the page, and only the form element and its error slot are client-side.
 */
export default function EditorForm({
  action,
  children,
  className,
}: {
  action: (state: EditorFormState, formData: FormData) => Promise<EditorFormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, EDITOR_FORM_INITIAL);
  const alertRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // The submit buttons are at the very bottom of these forms, so an error
    // rendered at the top would go unseen and read as "nothing happened".
    if (state.error) alertRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state.error]);

  return (
    /**
     * Submitted through onSubmit rather than `action={formAction}`, which looks
     * like the longer way round and is not.
     *
     * React 19 automatically resets a form once its `action` completes. Keeping
     * the refusal client-side therefore only half worked: the gallery, the
     * repeaters and the amenities survived because they are React state, but
     * every plain field — title, price, location, the whole description, the
     * type dropdown, the published and featured boxes — was reset to its
     * defaultValue, which on a new listing is empty. Measured, not assumed: a
     * refused save cleared all six.
     *
     * Dispatching inside startTransition instead is the documented way to keep
     * the form's contents. Native validation still runs, because the browser
     * only fires `submit` on a valid form, so `required` on Title behaves
     * exactly as before.
     *
     * The trade is that this form no longer submits with JavaScript disabled.
     * That costs nothing real here: the gallery, the repeaters and the amenity
     * picker are all client components, so without JavaScript there would be
     * nothing to submit.
     */
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        // Read the form synchronously — currentTarget is cleared once the
        // event handler returns, long before the transition runs.
        const data = new FormData(event.currentTarget);
        if (pending) return; // a second click while saving would post twice
        startTransition(() => formAction(data));
      }}
    >
      {state.error ? (
        <p
          ref={alertRef}
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {state.error}
        </p>
      ) : null}
      {children}
    </form>
  );
}
