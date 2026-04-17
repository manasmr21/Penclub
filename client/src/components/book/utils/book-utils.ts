export function renderStars(rating: number): boolean[] {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return Array.from({ length: 5 }, (_, index) => index < safeRating);
}

export function formatPublishedDate(dateInput?: string): string {
  if (!dateInput) return "Unknown";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

export function formatRelativeTime(dateInput?: string): string {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) return "Today";
  if (Math.abs(diffDays) < 30) return formatter.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return formatter.format(diffMonths, "month");

  return formatter.format(Math.round(diffMonths / 12), "year");
}

export function getInitials(name?: string): string {
  if (!name?.trim()) return "RD";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "RD";
}

export function getRatingDistribution(reviews: { rating?: number }[]) {
  const totalReviews = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating ?? 0) === star).length;
    return { star, count, width: `${Math.max(4, Math.round((count / totalReviews) * 100))}%` };
  });
}
