import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[85vh] items-center justify-center bg-dark-black text-center text-white">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">Error 404</p>
        <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </div>
    </section>
  );
}
