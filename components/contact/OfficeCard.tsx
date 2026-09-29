import type { OfficeInfo } from "@/lib/types";

/** Live `.office-card`: white, 1px #eee, 25px padding; hover -> gold border + 0 5px 20px
 *  rgba(0,0,0,.05). h5 #0a0a0a with a 2px #f0f0f0 underline and a 25px-wide gold icon. */
export default function OfficeCard({ name, icon, address, phone, email }: OfficeInfo) {
  return (
    <div className="h-full border border-border-card bg-white p-[25px] transition-all duration-300 hover:border-primary-gold hover:shadow-card">
      <h3 className="mb-4 flex items-center border-b-2 border-border-soft pb-2.5 text-xl font-bold text-dark-black">
        <i className={`${icon} mr-2.5 w-[25px] text-center text-primary-gold`} aria-hidden="true" />
        {name}
      </h3>
      <p className="mb-1 text-sm text-bs-muted">
        <strong className="text-dark-black">Address:</strong> {address}
      </p>
      {phone ? (
        <p className="text-sm text-bs-muted">
          <strong className="text-dark-black">Phone:</strong> {phone}
        </p>
      ) : null}
      {email ? (
        <p className="text-sm text-bs-muted">
          <strong className="text-dark-black">Email:</strong> {email}
        </p>
      ) : null}
    </div>
  );
}
