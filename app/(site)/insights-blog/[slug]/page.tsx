import { buildArticlePage } from "@/components/insights/articlePage";

const { generateStaticParams, generateMetadata, Page } = buildArticlePage("blog");

export { generateStaticParams, generateMetadata };
export default Page;
