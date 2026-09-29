import IconBadge from "@/components/ui/IconBadge";

type PMFeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function PMFeatureCard({ icon, title, description }: PMFeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-8 shadow-card-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover">
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary-gold transition-transform duration-400 group-hover:scale-x-100" />
      <IconBadge icon={icon} variant="tinted" flip size="lg" className="mb-6" />
      <h3 className="text-lg font-bold text-dark-black">{title}</h3>
      <p className="mt-3 text-muted">{description}</p>
    </div>
  );
}
