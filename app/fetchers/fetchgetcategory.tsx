import type { Category } from "@/lib/types/category";

export async function GetCategory(): Promise<Category[]> {
  const res = await fetch(`/api/category`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function GetCategoryById(id: number): Promise<Category> {
  const res = await fetch(`/api/category/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
