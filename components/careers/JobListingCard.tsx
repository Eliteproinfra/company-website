import Button from "@/components/ui/Button";
import type { JobListing } from "@/lib/data/careers";

export default function JobListingCard({ title, department, location, type, experience }: JobListing) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-bold text-dark-black">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <i className="fas fa-briefcase text-primary-gold" aria-hidden="true" /> {department}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fas fa-location-dot text-primary-gold" aria-hidden="true" /> {location} &middot; {type}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fas fa-clock text-primary-gold" aria-hidden="true" /> {experience}
          </span>
        </div>
      </div>
      <Button href="/contact" size="sm" className="w-fit shrink-0">
        Apply Now
      </Button>
    </div>
  );
}
