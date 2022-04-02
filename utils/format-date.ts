export default function formatDate(date: string): string {
  const format = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return format.format(new Date(date));
}
