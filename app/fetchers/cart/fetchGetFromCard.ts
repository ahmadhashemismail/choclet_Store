export async function GetCartProduct() {
  const res = await fetch("/api/cart", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data;
}

export async function AddProductToCart(productId: number): Promise<void> {
  const res = await fetch("/api/cart/addItemsToCard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add product to cart");
  }
}

export async function RemoveProductFromCart(productId: number): Promise<void> {
  const res = await fetch(`/api/cart/${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove product from cart");
  }
}
