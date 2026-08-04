import Image from "next/image";

export default function GalleryCard({ image, caption }: { image: string; caption: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={caption}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <p className="text-sm font-semibold text-white">{caption}</p>
      </div>
    </div>
  );
}
