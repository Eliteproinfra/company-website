type ContactInfoCardProps = {
  icon: string;
  title: string;
  value: string;
  href?: string;
};

export default function ContactInfoCard({ icon, title, value, href }: ContactInfoCardProps) {
  const card = (
    <div className="h-full rounded-2xl border border-neutral-100 border-b-4 border-b-transparent bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-b-primary-gold hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      <i className={`${icon} mb-4 text-3xl text-primary-gold`} aria-hidden="true" />
      <h3 className="font-bold text-dark-black">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{value}</p>
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
