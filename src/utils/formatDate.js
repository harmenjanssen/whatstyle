export default function formatDate(date) {
  const format = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return format.format(new Date(date));
}
