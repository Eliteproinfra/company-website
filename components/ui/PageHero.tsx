import clsx from "clsx";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";

type PageHeroProps = {
  image: string;
  title: string;
  breadcrumbCurrent: string;
  height?: "40vh" | "60vh" | "70vh" | "75vh";
  eyebrow?: string;
  description?: string;
  /**
   * Tailwind classes for the overlay layer, copied from each live hero's gradient
   * (e.g. properties/leadership `rgba(0,0,0,.6)` flat, awards `.6 -> .7`, contact `.7`).
   */
  overlay?: string;
  /** Live heroes that use `background-attachment: fixed` render as a CSS background. */
  fixed?: boolean;
  /** Live `.nri-corner-hero::after` / `.life-hero::after`: 100px fade to white at the bottom. */
  fadeToWhite?: boolean;
  /** Live `.pr-hero` / `.awards-hero` titles are `display-4 text-uppercase letter-spacing-2`. */
  uppercase?: boolean;
  /** Live team-page `.about-hero`s print the subtitle under the h1 and have no breadcrumb. */
  hideBreadcrumb?: boolean;
  /** Buttons or badges rendered under the copy, above the breadcrumb. */
  children?: React.ReactNode;
};

const heightClasses: Record<NonNullable<PageHeroProps["height"]>, string> = {
  "40vh": "min-h-[40vh]",
  "60vh": "h-[60vh]",
  "70vh": "h-[70vh]",
  "75vh": "h-[75vh]",
};

export default function PageHero({
  image,
  title,
  breadcrumbCurrent,
  height = "60vh",
  eyebrow,
  description,
  overlay = "bg-black/60",
  fixed = false,
  fadeToWhite = false,
  uppercase = false,
  hideBreadcrumb = false,
  children,
}: PageHeroProps) {
  return (
    <header
      className={clsx(
        "relative flex items-center justify-center overflow-hidden text-center text-white",
        heightClasses[height],
        fixed && "bg-cover bg-center bg-fixed"
      )}
      style={fixed ? { backgroundImage: `url(${image})` } : undefined}
    >
      {fixed ? null : (
        <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />
      )}
      <div className={clsx("absolute inset-0", overlay)} aria-hidden="true" />
      {fadeToWhite ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[100px] bg-linear-to-t from-white to-transparent"
          aria-hidden="true"
        />
      ) : null}
      <div className="container relative z-10">
        {eyebrow ? (
          <p className="mb-3 text-sm font-bold uppercase tracking-[2px] text-primary-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={clsx(
            "text-4xl font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] sm:text-5xl",
            uppercase && "uppercase tracking-[2px]"
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">{description}</p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
        {hideBreadcrumb ? null : (
          <div className="mt-5">
            <Breadcrumb current={breadcrumbCurrent} />
          </div>
        )}
      </div>
    </header>
  );
}
