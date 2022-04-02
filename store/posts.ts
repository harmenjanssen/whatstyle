import path from "path";
import fs from "fs";
import matter from "gray-matter";
import unified from "unified";
var markdown = require("remark-parse");
var html = require("remark-html");
const postsDirectory = path.join(process.cwd(), "content/posts");

interface PostFrontMatter {
  title: string;
  url: string;
  date: Date;
}

interface Post {
  title: string;
  url: string;
  date: string;
  contents: string;
}

let cachedPosts: Post[] = [];

export async function getList() {
  if (cachedPosts.length) {
    return cachedPosts;
  }
  const filenames = fs.readdirSync(postsDirectory);
  cachedPosts = await Promise.all(
    filenames
      .filter(
        (filename) => filename.endsWith(".md") && filename !== "_index.md"
      )
      .sort((a, b) => {
        // Assumption: all markdown files start with a date.
        return a === b ? 0 : a < b ? 1 : -1;
      })
      .map(async (filename) => {
        const content = fs.readFileSync(path.join(postsDirectory, filename));
        const frontMatter = matter(content);
        const postFrontMatter = frontMatter.data as PostFrontMatter;
        const processedContent = await unified()
          .use(markdown)
          .use(html)
          .process(frontMatter.content);
        return {
          title: postFrontMatter.title,
          url: postFrontMatter.url,
          date: postFrontMatter.date.toString(),
          contents: processedContent.toString(),
        };
      })
  );
  return cachedPosts;
}
