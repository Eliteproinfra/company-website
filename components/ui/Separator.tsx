import clsx from "clsx";

type SeparatorProps = {
  align?: "center" | "left";
  width?: 60 | 80;
  className?: string;
};

const widthClasses: Record<NonNullable<SeparatorProps["width"]>, string> = {
  60: "w-[60px]",
  80: "w-[80px]",
};

export default function Separator({ align = "center", width = 60, className }: SeparatorProps) {
  return (
    <div
      className={clsx(
        "h-[3px] bg-primary-gold",
        widthClasses[width],
        align === "center" && "mx-auto",
        className
      )}
    />
  );
}
