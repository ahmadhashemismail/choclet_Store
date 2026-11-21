import type { Cart } from "@/lib/types/Cart";

export async function getFavoriteProduct() {
  const res = await fetch("/api/favorite", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data;
}

export async function addFavoriteProduct(productId: number): Promise<void> {
  const res = await fetch("/api/favorite/add_Favorite_Product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add product to favorite page");
  }
}

export async function removeFavoriteProduct(productId: number): Promise<void> {
  const res = await fetch("/api/favorite", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove product from favorites");
  }
}