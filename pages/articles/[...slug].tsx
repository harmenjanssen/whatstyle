import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Context } from "vm";
import Layout from "../../components/Layout";
import { getList } from "../../store/posts";
import formatDate from "../../utils/format-date";

interface Props {
  post: {
    title: string;
    url: string;
    date: string;
    contents: string;
  };
}

const getYearsAgo = (date: string) =>
  new Date().getFullYear() - new Date(date).getFullYear();

const isOld = (date: string) => getYearsAgo(date) > 2;

const ArticleDetailPage = ({ post }: Props) => (
  <Layout title={`${post.title}, an article by Harmen Janssen`}>
    <article>
      <header>
        <h1>{post.title}</h1>
        {isOld(post.date) && (
          <p className="attention">
            <strong>
              👉 Whoa! Please note that this post is {getYearsAgo(post.date)}{" "}
              years old. The views expressed within might have become outdated.
            </strong>
          </p>
        )}
        <time>{formatDate(post.date)}</time>
      </header>
      <article dangerouslySetInnerHTML={{ __html: post.contents }}></article>

      <footer>
        <p>
          <Link href="/articles">
            <a>Back to the blog</a>
          </Link>
        </p>
      </footer>
    </article>
  </Layout>
);

export default ArticleDetailPage;

export const getStaticProps: GetStaticProps = async (context: Context) => {
  const slug = context.params.slug.reduce(
    (all: string, part: string) => `${all}/${part}`,
    `/articles`
  );
  const allPosts = await getList();
  const post = allPosts.find((post) => post.url === slug);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getList();
  return {
    paths: posts.map(({ url }) => url),
    fallback: false,
  };
};
