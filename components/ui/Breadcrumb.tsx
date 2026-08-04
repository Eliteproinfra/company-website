import Link from "next/link";

type BreadcrumbProps = {
  current: string;
};

export default function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center justify-center gap-2 text-sm text-white/80">
        <li>
          <Link href="/" className="text-white transition-colors hover:text-primary-gold">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-primary-gold" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
