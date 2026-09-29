import type { Stat } from "@/lib/types";

export default function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-t border-bs-secondary/25 bg-dark-radial py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold leading-none text-primary-gold sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm uppercase tracking-wide text-white sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
