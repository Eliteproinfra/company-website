import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import InstagramReelCard from "@/components/home/InstagramReelCard";
import { getLatestInstagramReels } from "@/lib/instagram";
import { socialLinks } from "@/lib/data/social";

const delaySequence = [0, 100, 200] as const;

const profileUrl =
  socialLinks.find((link) => link.label === "Instagram")?.href ??
  "https://www.instagram.com/eliteproinfra";

function FollowLink({ children }: { children: string }) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-gold transition-colors hover:text-white"
    >
      <i className="fab fa-instagram" aria-hidden="true" /> {children}
      <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
    </a>
  );
}

/**
 * Latest three Instagram videos/reels. Self-contained async server component:
 * it owns its own data fetch so a slow or broken Instagram API can only ever
 * degrade this one section, never the rest of the home page.
 */
export default async function InstagramReels() {
  const { items } = await getLatestInstagramReels(3);

  return (
    <section className="relative overflow-hidden bg-dark-black py-20">
      <div className="container relative">
        <SectionHeading
          eyebrow="Follow Us"
          title="Latest on Instagram"
          description="Project walkthroughs, market takes, and life at ElitePro — straight from our feed."
          dark
        />

        {items.length > 0 ? (
          <>
            {/* One centred, width-capped card per row on phones (the cap is what
                keeps a 4:5 portrait card from turning into a 600px-tall block),
                three across from md up. Three columns at `sm` would squeeze each
                card down to ~148px inside this project's 540px sm container. */}
            <div className="mx-auto grid max-w-xs grid-cols-1 gap-6 sm:max-w-sm md:max-w-none md:grid-cols-3">
              {items.map((reel, index) => (
                <Reveal key={reel.id} delay={delaySequence[index % delaySequence.length]}>
                  <InstagramReelCard reel={reel} />
                </Reveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <FollowLink>View more on Instagram</FollowLink>
            </div>
          </>
        ) : (
          // Every failure mode — no token configured, expired token, rate
          // limit, network error, an account with no videos yet — lands here.
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <i className="fab fa-instagram text-3xl text-primary-gold" aria-hidden="true" />
            <p className="mt-4 text-white/70">
              Our latest reels aren&apos;t available right now — catch them all on our Instagram
              profile.
            </p>
            <p className="mt-5">
              <FollowLink>Follow @eliteproinfra</FollowLink>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
