import { buildArticlePage } from "@/components/insights/articlePage";

const { generateStaticParams, generateMetadata, Page } = buildArticlePage("news");

export { generateStaticParams, generateMetadata };
export default Page;
