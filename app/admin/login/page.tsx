import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-dark-black">
      <Image
        src="/images/bg/skyline-towers.jpg"
        alt=""
        fill
        sizes="100vw"
        preload
        className="object-cover"
      />
      {/* Dark wash: the photo stays readable as texture, the copy stays legible. */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.82)_45%,rgba(10,10,10,0.96)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-8 lg:px-10 lg:py-10">
        <Image
          src="/images/Elite-pro-logo.png"
          alt="Elite Pro Infraventure"
          width={845}
          height={249}
          className="h-10 w-auto self-center object-contain sm:h-12 lg:self-start"
        />

        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
          <div className="text-center lg:text-left">
            <h1 className="text-[2.1rem] font-bold leading-[1.15] text-white sm:text-[2.75rem]">
              Manage Your
              <br />
              Elite Pro Website
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-text-gray lg:mx-0">
              Properties, enquiries, careers and insights — all updated from one
              secure dashboard.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
            <div className="bg-gradient-to-r from-primary-gold to-secondary-gold px-8 py-5 text-center">
              <h2 className="text-xl font-bold tracking-[0.5px] text-ink">Sign In</h2>
            </div>
            <div className="px-8 py-8">
              <LoginForm next={next ?? "/admin"} />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text-gray/70">
          Authorised personnel only. All sign-ins are logged.
        </p>
      </div>
    </main>
  );
}
