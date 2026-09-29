import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  // The admin must never reach an index, whatever robots.txt happens to say.
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">
            Elite Pro Infra
          </p>
          <h1 className="mt-2 text-2xl font-bold text-dark-black">Admin Sign In</h1>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="mt-6 text-center text-xs text-neutral-500">
          Authorised personnel only. All sign-ins are logged.
        </p>
      </div>
    </main>
  );
}
