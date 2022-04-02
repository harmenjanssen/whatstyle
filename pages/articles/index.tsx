import { GetStaticProps } from "next";
import ArticlePreview, {
  ArticlePreviewInterface,
} from "../../components/ArticlePreview";
import Layout from "../../components/Layout";
import { getList } from "../../store/posts";

interface Props {
  articles: ArticlePreviewInterface[];
}

const ArticleIndexPage = ({ articles }: Props) => (
  <Layout title="Web development blog by Harmen Janssen">
    <article>
      <header>
        <h1>Articles</h1>
      </header>

      <p>
        From 2006 to 2009 I ran this old blog.
        <br />I hate broken links, that’s why it’s still here.
      </p>

      <p className="attention">
        👉 For more modern web development articles, take a look at the{" "}
        <a href="https://grrr.tech">GRRR Tech Blog</a>, where I’m currently
        doing most of my writing.
      </p>
    </article>
    <ol className="articles">
      {articles.map((article, index) => (
        <li key={`article-${index}`}>
          <ArticlePreview {...article} />
        </li>
      ))}
    </ol>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const allArticles = await getList();

  return {
    props: {
      articles: allArticles.map(({ title, date, url }) => ({
        title,
        date,
        url,
      })),
    },
  };
};

export default ArticleIndexPage;
