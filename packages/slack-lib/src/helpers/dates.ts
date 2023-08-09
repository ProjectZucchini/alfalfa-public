export function formatLocalDate(date: Date) {
  // Slack: May 23rd at 1:25 PM
  // Fallback: May 23, 2023 at 5:25 p.m. UTC
  return `<!date^${Math.floor(
    date.getTime() / 1000,
  )}^{date} at {time}|${date.toLocaleString("en-CA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  })} UTC>`;
}
