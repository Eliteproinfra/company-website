import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  articleHref,
  articleSections,
  getArticleById,
  type Article,
} from "@/lib/data/articles";

export default function ArticleDetail({ article }: { article: Article }) {
  const section = articleSections[article.kind];
  const related = article.relatedIds
    .map((id) => getArticleById(article.kind, id))
    .filter((item): item is Article => Boolean(item));

  return (
    <section className="bg-bs-light pb-16 pt-28 lg:pt-32">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-card-lg lg:p-10">
              <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <i className="far fa-calendar-alt" aria-hidden="true" />
                  {article.date}
                </span>
                <span className="font-bold text-primary-gold">{section.label}</span>
              </div>

              <h1 className="text-2xl font-bold leading-snug text-dark-black">{article.title}</h1>

              {article.excerpt ? (
                <p className="mt-3 text-lg leading-relaxed text-muted">{article.excerpt}</p>
              ) : null}

              {/* Press clippings come in every aspect ratio, so render at the
                  image's own proportions rather than cropping to a fixed box. */}
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  width={article.imageWidth}
                  height={article.imageHeight}
                  priority
                  sizes="(min-width: 992px) 66vw, 100vw"
                  className="mt-4 h-auto w-full rounded-xl"
                />
              ) : null}

              <div
                className="article-body mt-6"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-8">
                <Button href={section.basePath} variant="outline" size="sm">
                  {section.backLabel}
                </Button>
              </div>
            </div>
          </article>

          {related.length ? (
            <aside className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow-card-lg lg:sticky lg:top-28">
                <h2 className="mb-4 font-bold text-dark-black">{section.relatedLabel}</h2>
                <div className="flex flex-col gap-4">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={articleHref(item)}
                      className="group flex items-start gap-3"
                    >
                      <div className="relative h-[62px] w-[82px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="82px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-snug text-dark-black transition-colors group-hover:text-primary-gold">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
