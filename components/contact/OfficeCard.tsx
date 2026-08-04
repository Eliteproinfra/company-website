import type { OfficeInfo } from "@/lib/types";

export default function OfficeCard({ name, icon, address, phone, email }: OfficeInfo) {
  return (
    <div className="h-full rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:border-primary-gold hover:shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
      <h3 className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-lg font-bold text-dark-black">
        <i className={`${icon} text-primary-gold`} aria-hidden="true" /> {name}
      </h3>
      <p className="mt-3 text-sm text-neutral-500">
        <strong className="text-dark-black">Address:</strong> {address}
      </p>
      {phone ? (
        <p className="mt-1 text-sm text-neutral-500">
          <strong className="text-dark-black">Phone:</strong> {phone}
        </p>
      ) : null}
      {email ? (
        <p className="mt-1 text-sm text-neutral-500">
          <strong className="text-dark-black">Email:</strong> {email}
        </p>
      ) : null}
    </div>
  );
}
