import { Product } from "@/lib/types/product";

export async function updateProduct(product: Product): Promise<Product> {
  const res = await fetch(`/api/product/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}