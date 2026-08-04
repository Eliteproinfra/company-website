import Reveal from "./Reveal";

type Stat = { value: string; label: string };

type StatsBandProps = {
  stats: Stat[];
};

const delays = [0, 100, 200, 300] as const;

export default function StatsBand({ stats }: StatsBandProps) {
  return (
    <section className="bg-[radial-gradient(circle_at_0_0,rgba(212,175,55,0.16),#111827)] py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={delays[index % delays.length]}>
              <p className="text-4xl font-bold text-primary-gold sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-white/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
