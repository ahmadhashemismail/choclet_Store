import { Cart } from "@/lib/types/Cart";

export async function updateQuantity(product: Cart): Promise<Cart> {
  const res = await fetch(`/api/cart/${product.product_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}