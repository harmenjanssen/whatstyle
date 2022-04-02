import formatDate from "../utils/format-date";

export interface ArticlePreviewInterface {
  title: string;
  url: string;
  date: string;
}

export default function ArticlePreview({
  title,
  url,
  date,
}: ArticlePreviewInterface) {
  return (
    <>
      <a href={url}>{title}</a>
      <time>{formatDate(date)}</time>
    </>
  );
}
