import IconBadge from "@/components/ui/IconBadge";

type VisionMissionCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function VisionMissionCard({ icon, title, description }: VisionMissionCardProps) {
  return (
    <div className="group h-full rounded-2xl bg-white p-8 shadow-sm">
      <IconBadge icon={icon} variant="tinted" className="mb-4" />
      <h3 className="text-xl font-bold text-dark-black">{title}</h3>
      <p className="mt-3 text-neutral-500">{description}</p>
    </div>
  );
}
