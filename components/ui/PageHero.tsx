import clsx from "clsx";
import Image from "next/image";
import Breadcrumb from "./Breadcrumb";

type PageHeroProps = {
  image: string;
  title: string;
  breadcrumbCurrent: string;
  height?: "60vh" | "75vh";
};

const heightClasses: Record<NonNullable<PageHeroProps["height"]>, string> = {
  "60vh": "h-[60vh]",
  "75vh": "h-[75vh]",
};

export default function PageHero({ image, title, breadcrumbCurrent, height = "60vh" }: PageHeroProps) {
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
        <h1 className="text-4xl font-bold [text-shadow:2px_2px_10px_rgba(0,0,0,0.5)] sm:text-5xl">
          {title}
        </h1>
        <div className="mt-5">
          <Breadcrumb current={breadcrumbCurrent} />
        </div>
      </div>
    </header>
  );
}
