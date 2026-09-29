import type { Testimonial } from "@/lib/types";

export default function PMTestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <div className="relative overflow-hidden rounded-[15px] border border-border-soft bg-white p-10 text-center shadow-card-lg">
      <i
        className="fas fa-quote-left absolute left-6 top-6 text-5xl text-primary-gold/10"
        aria-hidden="true"
      />
      <p className="relative italic leading-relaxed text-muted-2">{quote}</p>
      <h4 className="relative mt-6 font-bold text-dark-black">{name}</h4>
      <p className="relative text-sm text-primary-gold">{role}</p>
    </div>
  );
}
