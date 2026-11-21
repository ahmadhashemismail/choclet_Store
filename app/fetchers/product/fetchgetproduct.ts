import type { Product } from "@/lib/types/product";

export async function getProduct(): Promise<Product[]> {
  const res = await fetch("/api/product", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`/api/product/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch product");
  return data;
}