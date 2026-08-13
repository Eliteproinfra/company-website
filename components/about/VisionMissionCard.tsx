import IconBadge from "@/components/ui/IconBadge";

type VisionMissionCardProps = {
  icon: string;
  title: string;
  description: string;
  points?: string[];
};

export default function VisionMissionCard({
  icon,
  title,
  description,
  points,
}: VisionMissionCardProps) {
  return (
    <div className="group h-full rounded-2xl bg-white p-8 shadow-sm">
      <IconBadge icon={icon} variant="tinted" className="mb-4" />
      <h3 className="text-xl font-bold text-dark-black">{title}</h3>
      <p className="mt-3 text-neutral-500">{description}</p>
      {points?.length ? (
        <ul className="mt-5 space-y-2">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm font-semibold text-dark-black">
              <i className="fas fa-check text-primary-gold" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
