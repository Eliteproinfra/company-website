import type { Testimonial } from "@/lib/types";

export default function PMTestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <i
        className="fas fa-quote-left absolute left-6 top-6 text-5xl text-primary-gold/10"
        aria-hidden="true"
      />
      <p className="relative italic leading-relaxed text-neutral-600">{quote}</p>
      <h4 className="relative mt-6 font-bold text-dark-black">{name}</h4>
      <p className="relative text-sm text-primary-gold">{role}</p>
    </div>
  );
}
