export function getDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
