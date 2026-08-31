export type PageItem = {
  id: string;
  title: string;
  slug: string;
  status: "Published" | "Hidden";
  updatedAt: string;
  author: string;
};

export const initialPages: PageItem[] = [
  {
    id: "home",
    title: "Home",
    slug: "/",
    status: "Published",
    updatedAt: "Today, 10:30 AM",
    author: "Atlas Admin",
  },
  {
    id: "how-lmcs-works",
    title: "How LMCS Works",
    slug: "/how-lmcs-works",
    status: "Published",
    updatedAt: "Yesterday",
    author: "Atlas Admin",
  },
  {
    id: "project-assessment",
    title: "Project Assessment",
    slug: "/project-assessment",
    status: "Published",
    updatedAt: "Aug 26, 2026",
    author: "Atlas Admin",
  },
  {
    id: "atlas",
    title: "ATLAS",
    slug: "/atlas",
    status: "Published",
    updatedAt: "Aug 24, 2026",
    author: "Atlas Admin",
  },
  {
    id: "project-drift",
    title: "Project Drift",
    slug: "/project-drift",
    status: "Published",
    updatedAt: "Aug 22, 2026",
    author: "Atlas Admin",
  },
  {
    id: "delivery-confidence",
    title: "Delivery Confidence",
    slug: "/delivery-confidence",
    status: "Published",
    updatedAt: "Aug 20, 2026",
    author: "Atlas Admin",
  },
  {
    id: "insights",
    title: "Insights",
    slug: "/insights",
    status: "Published",
    updatedAt: "Aug 18, 2026",
    author: "Atlas Admin",
  },
  {
    id: "about",
    title: "About",
    slug: "/about",
    status: "Published",
    updatedAt: "Aug 15, 2026",
    author: "Atlas Admin",
  },
];

export async function fetchPages(): Promise<PageItem[]> {
  await new Promise((r) => setTimeout(r, 600));
  return initialPages;
}

export async function updatePage(
  id: string,
  updates: { title: string; status: PageItem["status"] },
): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, message: "Page updated successfully." };
}
