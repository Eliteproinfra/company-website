import Button from "@/components/ui/Button";
import type { JobListing } from "@/lib/data/careers";

/** Live `.job-card`: #fff, 1px #eee, 10px radius; hover -> gold border, 0 5px 20px
 *  rgba(0,0,0,.05), translateX(10px). Meta #666 with gold icons; `.apply-btn` #0a0a0a pill. */
export default function JobListingCard({ title, department, location, type, experience }: JobListing) {
  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-border-card bg-white p-[25px] transition-all duration-300 hover:translate-x-2.5 hover:border-primary-gold hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-[1.2rem] font-bold text-dark-black">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-[15px] gap-y-1 text-[0.9rem] text-muted">
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
      <Button href="/contact" variant="apply" size="sm" className="w-fit shrink-0">
        Apply Now
      </Button>
    </div>
  );
}
