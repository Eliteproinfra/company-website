import IconBadge from "@/components/ui/IconBadge";

type VisionMissionCardProps = {
  icon: string;
  title: string;
  description: string;
  points?: string[];
};

/** Live `.mission-card` / `.vision-card`: `rounded-4 border border-secondary bg-dark-gradient`
 *  on the `.story-mission` section; hover -> gold border with 0 20px 40px rgba(0,0,0,.5). */
export default function VisionMissionCard({
  icon,
  title,
  description,
  points,
}: VisionMissionCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-bs-secondary bg-dark-gradient p-8 text-white transition-all duration-300 hover:border-primary-gold hover:shadow-dark-card-hover">
      <IconBadge icon={icon} variant="tinted" className="mb-4" />
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-white/70">{description}</p>
      {points?.length ? (
        <ul className="mt-5 space-y-2">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <i className="fas fa-check text-primary-gold" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
