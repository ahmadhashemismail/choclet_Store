import type { Product } from "@/lib/types/product";
export async function GetProduct() {
  const res = await fetch(`/api/product`, {

    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function GetProductById(id: number): Promise<Product> {
  const res = await fetch(`/api/product/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
