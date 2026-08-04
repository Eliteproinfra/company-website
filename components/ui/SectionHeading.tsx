import clsx from "clsx";
import Separator from "./Separator";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  separator?: boolean;
  dark?: boolean;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  separator = true,
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx("mb-12", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[2px] text-primary-gold">{eyebrow}</p>
      ) : null}
      <h2
        className={clsx(
          "mt-2 text-3xl font-bold sm:text-4xl lg:text-[2.5rem]",
          dark ? "text-white" : "text-dark-black"
        )}
      >
        {title}
      </h2>
      {separator ? <Separator align={align} className="mt-4" /> : null}
      {description ? (
        <p
          className={clsx(
            "mt-4 text-text-gray",
            dark ? "text-white/70" : "text-neutral-500",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
