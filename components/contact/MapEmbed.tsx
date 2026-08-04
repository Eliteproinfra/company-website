export default function MapEmbed() {
  return (
    <div className="h-full min-h-[400px] overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
      <iframe
        title="Elite Pro Infraventure office location"
        src="https://www.google.com/maps?q=Golf+View+Corporate+Tower+A+Golf+Course+Road+Sector+42+Gurgaon&output=embed"
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
