import clsx from "clsx";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";

type PageHeroProps = {
  image: string;
  title: string;
  breadcrumbCurrent: string;
  height?: "60vh" | "75vh";
  eyebrow?: string;
  description?: string;
  /** Buttons or badges rendered under the copy, above the breadcrumb. */
  children?: React.ReactNode;
};

const heightClasses: Record<NonNullable<PageHeroProps["height"]>, string> = {
  "60vh": "h-[60vh]",
  "75vh": "h-[75vh]",
};

export default function PageHero({
  image,
  title,
  breadcrumbCurrent,
  height = "60vh",
  eyebrow,
  description,
  children,
}: PageHeroProps) {
  return (
    <header
      className={clsx(
        "relative flex items-center justify-center overflow-hidden text-center text-white",
        heightClasses[height]
      )}
    >
      <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="container relative z-10">
        {eyebrow ? (
          <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-primary-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">{description}</p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
        <div className="mt-5">
          <Breadcrumb current={breadcrumbCurrent} />
        </div>
      </div>
    </header>
  );
}
