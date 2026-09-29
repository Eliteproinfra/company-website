type ContactInfoCardProps = {
  icon: string;
  title: string;
  value: string;
  href?: string;
};

/** Live `.contact-card`: #fff, 1px #eee, 0 10px 30px rgba(0,0,0,.05), 3px transparent bottom
 *  border; hover lifts 10px, gold bottom border, 0 20px 40px rgba(0,0,0,.1). Icon 2.5rem gold. */
export default function ContactInfoCard({ icon, title, value, href }: ContactInfoCardProps) {
  const card = (
    <div className="h-full border border-border-card border-b-[3px] border-b-transparent bg-white px-[30px] py-10 text-center shadow-card-lg transition-all duration-300 hover:-translate-y-2.5 hover:border-b-primary-gold hover:shadow-card-hover">
      <i className={`${icon} mb-5 text-[2.5rem] text-primary-gold`} aria-hidden="true" />
      <h3 className="font-bold text-dark-black">{title}</h3>
      <p className="mt-2 text-sm text-muted">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block h-full">
        {card}
      </a>
    );
  }

  return card;
}
