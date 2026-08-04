import IconBadge from "@/components/ui/IconBadge";

type PMFeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function PMFeatureCard({ icon, title, description }: PMFeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary-gold transition-transform duration-400 group-hover:scale-x-100" />
      <IconBadge icon={icon} variant="tinted" flip size="lg" className="mb-6" />
      <h3 className="text-lg font-bold text-dark-black">{title}</h3>
      <p className="mt-3 text-neutral-500">{description}</p>
    </div>
  );
}
