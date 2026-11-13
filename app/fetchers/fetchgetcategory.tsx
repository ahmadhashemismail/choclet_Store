import type { Category } from "@/lib/types/category";

export async function GetCategory(): Promise<Category[]> {
  const res = await fetch("/api/category", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch categories");
  return data;
}
