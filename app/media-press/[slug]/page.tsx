import { buildArticlePage } from "@/components/insights/articlePage";

const { generateStaticParams, generateMetadata, Page } = buildArticlePage("press");

export { generateStaticParams, generateMetadata };
export default Page;
